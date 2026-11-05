import { CONTACT } from "@/content";
import type { Booking } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");

/** Start and end of a meeting, in the format calendar files and links use. */
export function calendarTimes(date: string, time: string, mins: number) {
  const [y, m, dd] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const start = new Date(y, m - 1, dd, h, mi);
  const end = new Date(start.getTime() + mins * 60000);
  const f = (x: Date) =>
    `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
  return { start: f(start), end: f(end) };
}

/** The text of a calendar invitation (.ics) with a reminder one day before. */
export function icsBody(b: Booking) {
  const { start, end } = calendarTimes(b.date, b.time, 30);
  return [
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
}

/** Downloads the calendar invitation as a file. */
export function downloadIcs(b: Booking) {
  const url = URL.createObjectURL(new Blob([icsBody(b)], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "ganli-meeting.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** A link that opens the meeting in Google Calendar, ready to save. */
export function googleCalendarLink(b: Booking) {
  const { start, end } = calendarTimes(b.date, b.time, 30);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: "פגישה עם מנהלת גנלי",
    dates: `${start}/${end}`,
    details: `${b.topic}. ${b.name}`,
    location: CONTACT.address,
    ctz: "Asia/Jerusalem",
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

/** WhatsApp with the text ready. Without a number it opens the contact or group picker. */
export function waLink(text: string, phone?: string) {
  return `https://wa.me/${phone ?? ""}?text=${encodeURIComponent(text)}`;
}

/** An Israeli phone number in the international format WhatsApp links need. */
export const waPhone = (phone: string) => phone.replace(/\D/g, "").replace(/^0/, "972");
