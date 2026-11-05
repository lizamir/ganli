import type { Booking } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");
const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const MEETING_TIMES = ["08:30", "12:45", "16:45"];

/** A date as YYYY-MM-DD in local time. */
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** The current time, as shown in the automation log. */
export const stamp = (d = new Date()) =>
  `${pad(d.getDate())}.${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

/** The working day `offset` days after `from`. The working week is Sunday to Thursday. */
export function nextWorkday(from: Date, offset: number) {
  const d = new Date(from);
  let added = 0;
  while (added < offset) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() <= 4) added++;
  }
  return d;
}

/** YYYY-MM-DD becomes "יום שני, 9.11". */
export function hebDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `יום ${DAYS[dt.getDay()]}, ${d}.${m}`;
}

/** The next working days with free slots for a meeting with the director. */
export function freeSlots(bookings: Booking[], days = 6, from = new Date()) {
  return Array.from({ length: days }, (_, i) => {
    const date = iso(nextWorkday(from, i + 1));
    const taken = bookings.filter((b) => b.date === date).map((b) => b.time);
    return { date, label: hebDate(date), times: MEETING_TIMES.filter((t) => !taken.includes(t)) };
  }).filter((d) => d.times.length);
}
