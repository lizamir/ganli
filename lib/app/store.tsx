"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { createDemoSnapshot, DEMO_PROFILES } from "./mock";
import {
  hebrewError,
  insertAnnouncement,
  checkOutChild,
  insertEvent,
  insertInquiry,
  insertLead,
  insertPayment,
  loadMemberships,
  loadSnapshot,
  rememberInstitution,
  resetDemoDay,
  resolveInquiry,
  type Membership,
  supabase,
  supabaseConfigured,
} from "./supabase";
import type { GanliActions, GanliSnapshot, InstitutionChoice, LeadInput, Profile, Role } from "./types";

type Status = "loading" | "out" | "needsSetup" | "ready";

type Ganli = {
  mode: "demo" | "supabase";
  status: Status;
  profile: Profile | null;
  data: GanliSnapshot | null;
  actions: GanliActions;
  institutions: InstitutionChoice[];
  submitLead: (lead: LeadInput) => Promise<string | null>;
  switchInstitution: (id: string) => void;
  signInDemo: (role: Role) => void;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

/* ───────── Demo store: mock data kept in this browser's localStorage ───────── */

type DemoState = { role: Role | null; data: GanliSnapshot };
const KEY = "ganli-demo-v2";
const listeners = new Set<() => void>();
let demoCache: DemoState | null = null;
const SERVER_STATE: { role: Role | null; data: GanliSnapshot | null } = { role: null, data: null };

function readDemo(): DemoState {
  if (demoCache) return demoCache;
  let stored: DemoState | null = null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) stored = JSON.parse(raw);
  } catch {
    // Private mode or blocked storage: start fresh.
  }
  demoCache = stored ?? { role: null, data: createDemoSnapshot() };
  return demoCache;
}

function writeDemo(next: DemoState) {
  demoCache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Still works for this visit.
  }
  listeners.forEach((l) => l());
}

const subscribeDemo = (l: () => void) => {
  listeners.add(l);
  // Another tab changed the demo data: reload it, so the parent window sees what staff just logged.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    demoCache = null;
    listeners.forEach((fn) => fn());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
};

function updateDemo(fn: (d: GanliSnapshot) => GanliSnapshot) {
  const s = readDemo();
  writeDemo({ ...s, data: fn(s.data) });
  return Promise.resolve(null);
}

const demoActions: GanliActions = {
  addEvent: (e) => updateDemo((d) => ({ ...d, events: [...d.events, { ...e, id: `e${Date.now()}` }] })),
  recordPayment: (chargeId, amount) =>
    updateDemo((d) => ({
      ...d,
      charges: d.charges.map((c) =>
        c.id === chargeId ? { ...c, paid: Math.min(c.amount, c.paid + amount), doc: c.doc || `חשבונית ${2100 + Math.floor(Math.random() * 99)}` } : c
      ),
    })),
  addAnnouncement: (title, body) =>
    updateDemo((d) => ({
      ...d,
      announcements: [{ id: `n${Date.now()}`, title, body, time: "עכשיו", needsRead: true, readBy: 0, of: 9 }, ...d.announcements],
    })),
  setInquiryDone: (id, done) => updateDemo((d) => ({ ...d, inquiries: d.inquiries.map((q) => (q.id === id ? { ...q, done } : q)) })),
  markRead: (id) =>
    updateDemo((d) => ({
      ...d,
      announcements: d.announcements.map((a) => (a.id === id && a.needsRead ? { ...a, needsRead: false, readBy: a.readBy + 1 } : a)),
    })),
  sendInquiry: ({ kind, text, childId }) =>
    updateDemo((d) => {
      const child = d.children.find((c) => c.id === childId);
      const who = child ? `${child.authorized[0]?.name ?? "הורה"}, הורה של ${child.name}` : "הורה";
      const inquiry = { id: `q${Date.now()}`, from: who, text, time: d.now, done: false, kind, childId, childName: child?.name };
      return {
        ...d,
        inquiries: [inquiry, ...d.inquiries],
        // An absence report takes effect right away in the demo: the child shows as absent today.
        children: kind === "absence" && childId ? d.children.map((c) => (c.id === childId ? { ...c, status: "absent" as const, absenceNote: "ההורה דיווח היעדרות" } : c)) : d.children,
      };
    }),
  checkOut: (childId) =>
    updateDemo((d) => ({ ...d, children: d.children.map((c) => (c.id === childId ? { ...c, status: "left" as const, pickup: d.now } : c)) })),
  planPickup: (childId, who, time) =>
    updateDemo((d) => ({ ...d, pickups: [...d.pickups.filter((p) => p.childId !== childId), { childId, who, time }] })),
  setRsvp: (eventId, answer) =>
    updateDemo((d) => ({
      ...d,
      upcoming: d.upcoming.map((u) => {
        if (u.id !== eventId || !u.rsvp) return u;
        const prev = u.rsvp.mine;
        let { going, notGoing } = u.rsvp;
        if (prev === "yes") going--;
        if (prev === "no") notGoing--;
        if (answer === "yes") going++;
        else notGoing++;
        return { ...u, rsvp: { ...u.rsvp, going, notGoing, mine: answer } };
      }),
    })),
  reset: () => writeDemo({ role: readDemo().role, data: createDemoSnapshot() }),
};

/* ───────── Provider ───────── */

const Ctx = createContext<Ganli | null>(null);

function useDemo(): Ganli {
  const state = useSyncExternalStore<{ role: Role | null; data: GanliSnapshot | null }>(subscribeDemo, readDemo, () => SERVER_STATE);
  const hydrated = state !== SERVER_STATE;
  return {
    mode: "demo",
    status: !hydrated ? "loading" : state.role ? "ready" : "out",
    profile: state.role ? DEMO_PROFILES[state.role] : null,
    data: state.data,
    actions: demoActions,
    institutions: [],
    submitLead: (lead) =>
      updateDemo((d) => ({
        ...d,
        leads: [{ ...lead, id: `l${Date.now()}`, time: new Date().toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" }) }, ...(d.leads ?? [])],
      })),
    switchInstitution: () => {},
    signInDemo: (role) => writeDemo({ ...readDemo(), role }),
    signIn: async () => "השרת לא מחובר. היכנסו עם אחד מחשבונות הדמו",
    signOut: async () => writeDemo({ ...readDemo(), role: null }),
  };
}

function useSupabase(): Ganli {
  const [status, setStatus] = useState<Status>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [data, setData] = useState<GanliSnapshot | null>(null);
  const [member, setMember] = useState<Membership | null>(null);
  const [institutions, setInstitutions] = useState<InstitutionChoice[]>([]);

  const refresh = useCallback(async () => {
    const res = await loadMemberships();
    const m = res?.current ?? null;
    setMember(m);
    setInstitutions(res?.all ?? []);
    if (!m) {
      const { data: auth } = await supabase!.auth.getUser();
      setStatus(auth.user ? "needsSetup" : "out");
      setProfile(null);
      setData(null);
      return;
    }
    const snap = await loadSnapshot(m);
    setProfile(snap.profile);
    setData(snap.snapshot);
    setStatus("ready");
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "SIGNED_OUT") refresh();
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  // The server has no push channel here yet, so check for news every 30 seconds while the tab is visible.
  useEffect(() => {
    if (status !== "ready") return;
    const t = setInterval(() => {
      if (!document.hidden) refresh();
    }, 30000);
    return () => clearInterval(t);
  }, [status, refresh]);

  const after = useCallback(
    async (p: Promise<string | null>) => {
      const err = await p;
      if (!err) await refresh();
      return err;
    },
    [refresh]
  );

  const actions = useMemo<GanliActions>(
    () => ({
      addEvent: (e) => (member ? after(insertEvent(member, e)) : Promise.resolve("לא מחובר")),
      recordPayment: (id, amount) => (member ? after(insertPayment(member, id, amount)) : Promise.resolve("לא מחובר")),
      addAnnouncement: (t, b) => (member ? after(insertAnnouncement(member, t, b)) : Promise.resolve("לא מחובר")),
      setInquiryDone: (id, done) => after(resolveInquiry(id, done)),
      markRead: async () => null,
      sendInquiry: (input) => (member ? after(insertInquiry(member, input)) : Promise.resolve("לא מחובר")),
      checkOut: (childId) => (member ? after(checkOutChild(member, childId)) : Promise.resolve("לא מחובר")),
      planPickup: async () => "תכנון איסוף עוד לא נשמר בשרת",
      setRsvp: async () => "אישורי הגעה עוד לא נשמרים בשרת",
      reset: institutions.find((i) => i.id === member?.institution_id)?.name.endsWith("(דמו)")
        ? async () => {
            if (member) await after(resetDemoDay(member));
          }
        : undefined,
    }),
    [member, after, institutions]
  );

  return {
    mode: "supabase",
    status,
    profile,
    data,
    actions,
    institutions,
    submitLead: async (lead) => {
      const inst = process.env.NEXT_PUBLIC_GANLI_INSTITUTION_ID;
      return inst ? insertLead(inst, lead) : "הרשמה מקוונת עוד לא מחוברת. התקשרו אלינו";
    },
    switchInstitution: (id) => {
      rememberInstitution(id);
      setStatus("loading");
      refresh();
    },
    signInDemo: () => {},
    signIn: async (email, password) => {
      const { error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password });
      return error ? hebrewError(error.message) : null;
    },
    signOut: async () => {
      await supabase!.auth.signOut();
    },
  };
}

const useGanliSource = supabaseConfigured ? useSupabase : useDemo;

export function GanliProvider({ children }: { children: ReactNode }) {
  const value = useGanliSource();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGanli() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useGanli must be used inside GanliProvider");
  return v;
}
