"use client";

import { useSyncExternalStore } from "react";
import { AUTOMATIONS } from "./catalog";
import { hebDate, iso, nextWorkday, stamp } from "./schedule";
import type { AutoState, Booking, LogItem } from "./types";

/**
 * Ganli's automations, kept in this browser (works the same in the demo and next to Supabase).
 * What is real: calendar files (.ics), Google Calendar links and WhatsApp messages that open ready to send.
 * Sending WhatsApp messages with no click at all needs the WhatsApp Business API (e.g. through n8n); that is
 * shown as the next step, never as something that already happened.
 */

const KEY = "ganli-auto-v1";
const listeners = new Set<() => void>();
let cache: AutoState | null = null;
const SERVER: AutoState = { bookings: [], signups: [], log: [], on: {} };

/** A short random id. */
const uid = () => Math.random().toString(36).slice(2, 9);
/** The starting state: one open sign-up list and every automation on. */
function seed(): AutoState {
  return {
    bookings: [],
    signups: [
      {
        id: "trip",
        title: "טיול לגינה הקהילתית",
        deadline: iso(nextWorkday(new Date(), 2)),
        signed: ["k3", "k5", "k6"],
      },
    ],
    log: [],
    on: Object.fromEntries(AUTOMATIONS.map((a) => [a.id, true])),
  };
}

/** The automation state, cached in memory and restored from this browser. */
function read(): AutoState {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as AutoState) : seed();
  } catch {
    cache = seed();
  }
  return cache;
}
/** Saves the state and tells every screen. */
function write(next: AutoState) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* blocked storage: keep it for this visit */
  }
  listeners.forEach((l) => l());
}
/** Lets React listen for changes, including ones made in another tab. */
function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    removeEventListener("storage", onStorage);
  };
}

/** The automation state, as a React hook. */
export function useAutomations() {
  return useSyncExternalStore(subscribe, read, () => SERVER);
}

/** Adds a line to the log, keeping the latest 30. */
const addLog = (s: AutoState, text: string): LogItem[] => [{ id: uid(), at: stamp(), text }, ...s.log].slice(0, 30);

/** Everything that changes the automation state. Each action also writes to the log. */
export const auto = {
  book(b: Omit<Booking, "id" | "created">) {
    const s = read();
    const booking: Booking = { ...b, id: uid(), created: stamp() };
    write({
      ...s,
      bookings: [...s.bookings, booking],
      log: addLog(s, `נקבעה פגישה: ${b.name}, ${hebDate(b.date)} ב‑${b.time}. נוצר זימון ליומן.`),
    });
    return booking;
  },
  cancel(id: string) {
    const s = read();
    const b = s.bookings.find((x) => x.id === id);
    write({
      ...s,
      bookings: s.bookings.filter((x) => x.id !== id),
      log: b ? addLog(s, `בוטלה פגישה: ${b.name}`) : s.log,
    });
  },
  sign(signupId: string, childId: string, childName: string, yes: boolean) {
    const s = read();
    write({
      ...s,
      signups: s.signups.map((x) =>
        x.id !== signupId
          ? x
          : { ...x, signed: yes ? [...new Set([...x.signed, childId])] : x.signed.filter((c) => c !== childId) },
      ),
      log: addLog(s, `${yes ? "נרשם/ה" : "בוטלה הרשמה"}: ${childName}`),
    });
  },
  addSignup(title: string, deadline: string) {
    const s = read();
    write({
      ...s,
      signups: [{ id: uid(), title, deadline, signed: [] }, ...s.signups],
      log: addLog(s, `נפתחה רשימת הרשמה: ${title}`),
    });
  },
  toggle(id: string) {
    const s = read();
    const on = !s.on[id];
    const a = AUTOMATIONS.find((x) => x.id === id);
    write({
      ...s,
      on: { ...s.on, [id]: on },
      log: addLog(s, `${on ? "הופעלה" : "הושבתה"} אוטומציה: ${a?.trigger ?? id}`),
    });
  },
  note(text: string) {
    const s = read();
    write({ ...s, log: addLog(s, text) });
  },
  reset() {
    write(seed());
  },
};
