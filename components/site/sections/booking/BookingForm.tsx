"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { freeSlots } from "@/lib/automations/schedule";
import { auto, useAutomations } from "@/lib/automations/store";
import type { Booking } from "@/lib/automations/types";

const TOPICS = ["היכרות והרשמה לשנה הבאה", "שיחה על הילד", "תשלומים וכספים", "אחר"];

/** Pick a free day and time, and leave a name and phone number. */
export default function BookingForm({ onBooked }: { onBooked: (b: Booking) => void }) {
  const { bookings } = useAutomations();
  // dates depend on "today", so they are computed only in the browser, never in the static HTML
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const days = useMemo(() => (ready ? freeSlots(bookings) : []), [bookings, ready]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [err, setErr] = useState("");
  const day = days.find((d) => d.date === date) ?? days[0];

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const phone = String(f.get("phone") || "").trim();
    if (!day || !time) return setErr("בחרו יום ושעה.");
    if (!name || phone.replace(/\D/g, "").length < 9) return setErr("מלאו שם וטלפון תקין.");
    setErr("");
    onBooked(auto.book({ name, phone, date: day.date, time, topic: String(f.get("topic")) }));
  };

  return (
    <form onSubmit={submit} noValidate className="meet-form">
      <fieldset className="slot-group">
        <legend>יום</legend>
        <div className="slots">
          {days.map((d) => (
            <button
              key={d.date}
              type="button"
              aria-pressed={day?.date === d.date}
              onClick={() => {
                setDate(d.date);
                setTime("");
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="slot-group">
        <legend>שעה</legend>
        <div className="slots">
          {day?.times.map((t) => (
            <button key={t} type="button" aria-pressed={time === t} onClick={() => setTime(t)} dir="ltr">
              {t}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="row">
        <label>
          שם
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          טלפון
          <input name="phone" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" required />
        </label>
      </div>
      <label>
        נושא
        <select name="topic" defaultValue={TOPICS[0]}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      {err && (
        <p className="form-error" role="alert">
          {err}
        </p>
      )}
      <button className="btn btn-primary">קביעת פגישה ←</button>
    </form>
  );
}
