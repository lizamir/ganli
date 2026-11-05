// Demo mode: mock data kept in this browser's localStorage.
import { createDemoSnapshot } from "@/lib/mock/demoSnapshot";
import type { GanliActions, GanliSnapshot, Role } from "@/lib/domain/types";

type DemoState = { role: Role | null; data: GanliSnapshot };
const KEY = "ganli-demo-v2";
const listeners = new Set<() => void>();
let demoCache: DemoState | null = null;
export const SERVER_STATE: { role: Role | null; data: GanliSnapshot | null } = { role: null, data: null };

/** The demo state, cached in memory and restored from this browser. */
export function readDemo(): DemoState {
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

/** Saves the demo state and tells every screen. */
export function writeDemo(next: DemoState) {
  demoCache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Still works for this visit.
  }
  listeners.forEach((l) => l());
}

/** Lets React listen for changes, including ones made in another tab. */
export const subscribeDemo = (l: () => void) => {
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

/** Changes the demo data and reports success, the same way a server call would. */
export function updateDemo(fn: (d: GanliSnapshot) => GanliSnapshot) {
  const s = readDemo();
  writeDemo({ ...s, data: fn(s.data) });
  return Promise.resolve(null);
}

/** The demo version of every action the dashboards can take. */
export const demoActions: GanliActions = {
  addEvent: (e) => updateDemo((d) => ({ ...d, events: [...d.events, { ...e, id: `e${Date.now()}` }] })),
  recordPayment: (chargeId, amount) =>
    updateDemo((d) => ({
      ...d,
      charges: d.charges.map((c) =>
        c.id === chargeId
          ? {
              ...c,
              paid: Math.min(c.amount, c.paid + amount),
              doc: c.doc || `חשבונית ${2100 + Math.floor(Math.random() * 99)}`,
            }
          : c,
      ),
    })),
  addAnnouncement: (title, body) =>
    updateDemo((d) => ({
      ...d,
      announcements: [
        { id: `n${Date.now()}`, title, body, time: "עכשיו", needsRead: true, readBy: 0, of: 9 },
        ...d.announcements,
      ],
    })),
  setInquiryDone: (id, done) =>
    updateDemo((d) => ({ ...d, inquiries: d.inquiries.map((q) => (q.id === id ? { ...q, done } : q)) })),
  markRead: (id) =>
    updateDemo((d) => ({
      ...d,
      announcements: d.announcements.map((a) =>
        a.id === id && a.needsRead ? { ...a, needsRead: false, readBy: a.readBy + 1 } : a,
      ),
    })),
  sendInquiry: ({ kind, text, childId }) =>
    updateDemo((d) => {
      const child = d.children.find((c) => c.id === childId);
      const who = child ? `${child.authorized[0]?.name ?? "הורה"}, הורה של ${child.name}` : "הורה";
      const inquiry = {
        id: `q${Date.now()}`,
        from: who,
        text,
        time: d.now,
        done: false,
        kind,
        childId,
        childName: child?.name,
      };
      return {
        ...d,
        inquiries: [inquiry, ...d.inquiries],
        // An absence report takes effect right away in the demo: the child shows as absent today.
        children:
          kind === "absence" && childId
            ? d.children.map((c) =>
                c.id === childId ? { ...c, status: "absent" as const, absenceNote: "ההורה דיווח היעדרות" } : c,
              )
            : d.children,
      };
    }),
  checkOut: (childId) =>
    updateDemo((d) => ({
      ...d,
      children: d.children.map((c) => (c.id === childId ? { ...c, status: "left" as const, pickup: d.now } : c)),
    })),
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
