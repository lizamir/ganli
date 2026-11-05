import { useEffect, useRef, useState } from "react";
import { useGanli } from "@/lib/data/GanliProvider";

/** Live notices: a new care event for the parent's child, or a new inquiry for staff and admin. */
export function useLiveToasts() {
  const { data, profile } = useGanli();
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  const seen = useRef<Set<string> | null>(null);
  const seenFor = useRef("");

  useEffect(() => {
    if (!data || !profile) return;
    const who = `${profile.role}:${profile.childId ?? ""}`;
    if (seenFor.current !== who) {
      seenFor.current = who; // a different role or child: start fresh, no stale notices
      seen.current = null;
    }
    const current = new Map<string, string>();
    if (profile.role === "parent") {
      for (const e of data.events)
        if (e.childId === profile.childId) current.set(`e${e.id}`, `${e.by ?? "הצוות"} עדכנה: ${e.title}`);
    } else {
      for (const q of data.inquiries)
        current.set(
          `q${q.id}`,
          q.kind === "absence" ? `דיווח היעדרות: ${q.childName ?? q.from}` : `פנייה חדשה: ${q.from}`,
        );
    }
    if (seen.current === null) {
      seen.current = new Set(current.keys());
      return;
    }
    const fresh = [...current].filter(([id]) => !seen.current!.has(id));
    if (!fresh.length) return;
    fresh.forEach(([id]) => seen.current!.add(id));
    // Syncing the UI with data that changed outside React (another tab, or the server).
    setToasts((t) => [...t, ...fresh.map(([id, text]) => ({ id, text }))].slice(-3));
  }, [data, profile]);

  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => setToasts((x) => x.slice(1)), 6000);
    return () => clearTimeout(t);
  }, [toasts]);

  return toasts;
}
