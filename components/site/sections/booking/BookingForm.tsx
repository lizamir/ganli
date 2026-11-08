"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { freeSlots } from "@/lib/automations/schedule";
import { auto, useAutomations } from "@/lib/automations/store";
import type { Booking } from "@/lib/automations/types";
import { formError } from "@/components/dashboard/ui/form";
import { cn } from "@/lib/ui/cn";
import { formButton, formField, formLabel, formRow } from "@/components/site/form";

const TOPICS = ["היכרות והרשמה לשנה הבאה", "שיחה על הילד", "תשלומים וכספים", "אחר"];

const slot =
  "min-h-[44px] rounded-[14px] [border:2px_solid_var(--sand)] bg-cream px-[14px] py-2 [font:600_0.95rem_var(--font-body)] text-cocoa-deep [transition:background_0.2s,border-color_0.2s] hover:border-teal aria-pressed:border-teal-deep aria-pressed:bg-teal-deep aria-pressed:text-white";

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
    <form onSubmit={submit} noValidate className="grid gap-4">
      <fieldset className="m-0 grid min-w-0 gap-2 p-0 [border:0]">
        <legend className="mb-2 p-0 text-[0.95rem] font-bold text-cocoa-deep">יום</legend>
        <div className="flex flex-wrap gap-2">
          {days.map((d) => (
            <button
              key={d.date}
              type="button"
              className={slot}
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
      <fieldset className="m-0 grid min-w-0 gap-2 p-0 [border:0]">
        <legend className="mb-2 p-0 text-[0.95rem] font-bold text-cocoa-deep">שעה</legend>
        <div className="flex flex-wrap gap-2">
          {day?.times.map((t) => (
            <button
              key={t}
              type="button"
              className={slot}
              aria-pressed={time === t}
              onClick={() => setTime(t)}
              dir="ltr"
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>
      <div className={formRow}>
        <label className={formLabel}>
          שם
          <input className={formField} name="name" autoComplete="name" required />
        </label>
        <label className={formLabel}>
          טלפון
          <input className={formField} name="phone" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" required />
        </label>
      </div>
      <label className={formLabel}>
        נושא
        <select className={formField} name="topic" defaultValue={TOPICS[0]}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      {err && (
        <p className={formError} role="alert">
          {err}
        </p>
      )}
      <button className={cn("btn btn-primary", formButton)}>קביעת פגישה ←</button>
    </form>
  );
}
