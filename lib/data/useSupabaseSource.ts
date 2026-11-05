import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/api/client";
import { hebrewError } from "@/lib/api/errors";
import { loadMemberships, rememberInstitution, type Membership } from "@/lib/api/memberships";
import {
  checkOutChild,
  insertAnnouncement,
  insertEvent,
  insertInquiry,
  insertLead,
  insertPayment,
  resetDemoDay,
  resolveInquiry,
} from "@/lib/api/mutations";
import { loadSnapshot } from "@/lib/api/snapshot";
import type { GanliActions, GanliSnapshot, InstitutionChoice, Profile } from "@/lib/domain/types";
import type { Ganli, Status } from "./types";

/** The real data source: signs in with Supabase, and refreshes after every change and every 30 seconds. */
export function useSupabaseSource(): Ganli {
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
    [refresh],
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
    [member, after, institutions],
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
