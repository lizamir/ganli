"use client";

import { useSyncExternalStore } from "react";
import { CONTACT } from "@/lib/content";

/**
 * Ganli's automations, kept in this browser (works the same in the demo and next to Supabase).
 * What is real: calendar files (.ics), Google Calendar links and WhatsApp messages that open ready to send.
 * Sending WhatsApp messages with no click at all needs the WhatsApp Business API (e.g. through n8n); that is
 * shown as the next step, never as something that already happened.
 */

export type Booking = { id: string; name: string; phone: string; date: string; time: string; topic: string; created: string };
export type Signup = { id: string; title: string; deadline: string; signed: string[] };
export type LogItem = { id: string; at: string; text: string };
export type AutoState = { bookings: Booking[]; signups: Signup[]; log: LogItem[]; on: Record<string, boolean> };

export const AUTOMATIONS = [
  { id: "lead", trigger: "פנייה חדשה מהאתר", action: "הודעת וואטסאפ למנהלת עם הפרטים, ומענה אוטומטי להורה שהפנייה התקבלה." },
  { id: "meeting", trigger: "נקבעה פגישה עם המנהלת", action: "זימון ליומן להורה ולמנהלת, ותזכורת בוואטסאפ יום לפני." },
  { id: "signup", trigger: "רשימת הרשמה דחופה", action: "תזכורת להורים שעוד לא נרשמו, יומיים ושעה לפני הסגירה." },
  { id: "summary", trigger: "סוף יום בגן (16:00)", action: "סיכום יומי להורה: ארוחות, שינה ותמונה אחת." },
  { id: "payment", trigger: "תשלום שעבר את מועדו", action: "תזכורת עדינה להורה עם קישור לתשלום, ועדכון בדוח הכספים." },
];

const KEY = "ganli-auto-v1";
const listeners = new Set<() => void>();
let cache: AutoState | null = null;
const SERVER: AutoState = { bookings: [], signups: [], log: [], on: {} };

const pad = (n: number) => String(n).padStart(2, "0");
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const uid = () => Math.random().toString(36).slice(2, 9);
const stamp = () => {
  const d = new Date();
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function nextWorkday(from: Date, offset: number) {
  const d = new Date(from);
  let added = 0;
  while (added < offset) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() <= 4) added++; // Sunday to Thursday
  }
  return d;
}

function seed(): AutoState {
  return {
    bookings: [],
    signups: [{ id: "trip", title: "טיול לגינה הקהילתית", deadline: iso(nextWorkday(new Date(), 2)), signed: ["k3", "k5", "k6"] }],
    log: [],
    on: Object.fromEntries(AUTOMATIONS.map((a) => [a.id, true])),
  };
}

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
function write(next: AutoState) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* blocked storage: keep it for this visit */
  }
  listeners.forEach((l) => l());
}
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

export function useAutomations() {
  return useSyncExternalStore(subscribe, read, () => SERVER);
}

const addLog = (s: AutoState, text: string): LogItem[] => [{ id: uid(), at: stamp(), text }, ...s.log].slice(0, 30);

export const auto = {
  book(b: Omit<Booking, "id" | "created">) {
    const s = read();
    const booking: Booking = { ...b, id: uid(), created: stamp() };
    write({ ...s, bookings: [...s.bookings, booking], log: addLog(s, `נקבעה פגישה: ${b.name}, ${hebDate(b.date)} ב‑${b.time}. נוצר זימון ליומן.`) });
    return booking;
  },
  cancel(id: string) {
    const s = read();
    const b = s.bookings.find((x) => x.id === id);
    write({ ...s, bookings: s.bookings.filter((x) => x.id !== id), log: b ? addLog(s, `בוטלה פגישה: ${b.name}`) : s.log });
  },
  sign(signupId: string, childId: string, childName: string, yes: boolean) {
    const s = read();
    write({
      ...s,
      signups: s.signups.map((x) => (x.id !== signupId ? x : { ...x, signed: yes ? [...new Set([...x.signed, childId])] : x.signed.filter((c) => c !== childId) })),
      log: addLog(s, `${yes ? "נרשם/ה" : "בוטלה הרשמה"}: ${childName}`),
    });
  },
  addSignup(title: string, deadline: string) {
    const s = read();
    write({ ...s, signups: [{ id: uid(), title, deadline, signed: [] }, ...s.signups], log: addLog(s, `נפתחה רשימת הרשמה: ${title}`) });
  },
  toggle(id: string) {
    const s = read();
    const on = !s.on[id];
    const a = AUTOMATIONS.find((x) => x.id === id);
    write({ ...s, on: { ...s.on, [id]: on }, log: addLog(s, `${on ? "הופעלה" : "הושבתה"} אוטומציה: ${a?.trigger ?? id}`) });
  },
  note(text: string) {
    const s = read();
    write({ ...s, log: addLog(s, text) });
  },
  reset() {
    write(seed());
  },
};

/* ───────── helpers that do real things ───────── */

const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
export function hebDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `יום ${DAYS[dt.getDay()]}, ${d}.${m}`;
}

/** The next working days with free slots for a meeting with the director. */
export function freeSlots(bookings: Booking[], days = 6) {
  const TIMES = ["08:30", "12:45", "16:45"];
  return Array.from({ length: days }, (_, i) => {
    const date = iso(nextWorkday(new Date(), i + 1));
    const taken = bookings.filter((b) => b.date === date).map((b) => b.time);
    return { date, label: hebDate(date), times: TIMES.filter((t) => !taken.includes(t)) };
  }).filter((d) => d.times.length);
}

const ics = (d: string, t: string, mins: number) => {
  const [y, m, dd] = d.split("-").map(Number);
  const [h, mi] = t.split(":").map(Number);
  const start = new Date(y, m - 1, dd, h, mi);
  const end = new Date(start.getTime() + mins * 60000);
  const f = (x: Date) => `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
  return { start: f(start), end: f(end) };
};

/** Downloads a real calendar invitation (.ics) with a reminder one day before. */
export function downloadIcs(b: Booking) {
  const { start, end } = ics(b.date, b.time, 30);
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ganli//Meetings//HE",
    "BEGIN:VEVENT",
    `UID:${b.id}@ganli`,
    `DTSTAMP:${start}`,
    `DTSTART;TZID=Asia/Jerusalem:${start}`,
    `DTEND;TZID=Asia/Jerusalem:${end}`,
    `SUMMARY:פגישה עם מנהלת גנלי`,
    `DESCRIPTION:${b.topic}. ${b.name}, ${b.phone}`,
    `LOCATION:${CONTACT.address}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:תזכורת: פגישה בגנלי מחר",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "ganli-meeting.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function googleCalendarLink(b: Booking) {
  const { start, end } = ics(b.date, b.time, 30);
  const q = new URLSearchParams({ action: "TEMPLATE", text: "פגישה עם מנהלת גנלי", dates: `${start}/${end}`, details: `${b.topic}. ${b.name}`, location: CONTACT.address, ctz: "Asia/Jerusalem" });
  return `https://calendar.google.com/calendar/render?${q}`;
}

/** WhatsApp with the text ready. Without a number it opens the contact or group picker. */
export function waLink(text: string, phone?: string) {
  return `https://wa.me/${phone ?? ""}?text=${encodeURIComponent(text)}`;
}
