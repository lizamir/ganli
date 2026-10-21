"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { auto, downloadIcs, freeSlots, googleCalendarLink, hebDate, useAutomations, waLink, type Booking as B } from "@/lib/app/automations";
import { CONTACT } from "@/lib/content";

const TOPICS = ["היכרות והרשמה לשנה הבאה", "שיחה על הילד", "תשלומים וכספים", "אחר"];

/** Book a 30-minute meeting with the director: pick a free slot, then add it to your calendar and confirm on WhatsApp. */
export default function Booking() {
  const { bookings } = useAutomations();
  // dates depend on "today", so they are computed only in the browser, never in the static HTML
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const days = useMemo(() => (ready ? freeSlots(bookings) : []), [bookings, ready]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [done, setDone] = useState<B | null>(null);
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
    setDone(auto.book({ name, phone, date: day.date, time, topic: String(f.get("topic")) }));
  };

  return (
    <section className="section meet" id="meet" aria-labelledby="meet-title">
      <div className="container meet-grid">
        <div className="reveal">
          <p className="eyebrow">
            <b>(07)</b> פגישה עם המנהלת
          </p>
          <h2 id="meet-title" className="title">
            קובעים פגישה
            <br />
            <span className="serif ink-tomato">בלי טלפונים</span>.
          </h2>
          <p className="lead" style={{ marginTop: 20 }}>
            בוחרים זמן פנוי, ומקבלים זימון ליומן ותזכורת יום לפני. המנהלת רואה את הפגישה מיד באזור האישי.
          </p>
          <ul className="meet-how">
            <li>
              <b>1</b> בוחרים יום ושעה פנויים
            </li>
            <li>
              <b>2</b> מוסיפים ליומן בלחיצה
            </li>
            <li>
              <b>3</b> שולחים אישור בוואטסאפ
            </li>
          </ul>
        </div>

        <div className="meet-card form reveal" aria-live="polite">
          {done ? (
            <div className="meet-done">
              <h3>הפגישה נקבעה ✓</h3>
              <p>
                {hebDate(done.date)} ב‑{done.time} · {done.topic}
              </p>
              <div className="meet-actions">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => downloadIcs(done)}>
                  הוספה ליומן (קובץ)
                </button>
                <a className="btn btn-ghost btn-sm" href={googleCalendarLink(done)} target="_blank" rel="noreferrer">
                  ליומן גוגל
                </a>
                <a
                  className="btn btn-wa btn-sm"
                  href={waLink(`היי, קבעתי פגישה עם המנהלת: ${hebDate(done.date)} ב‑${done.time} (${done.topic}). ${done.name}`, CONTACT.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                >
                  אישור בוואטסאפ
                </a>
              </div>
              <button type="button" className="link-btn" onClick={() => setDone(null)}>
                לקבוע פגישה נוספת
              </button>
              <p className="form-note">בדמו הפגישה נשמרת בדפדפן הזה ומופיעה למנהלת באזור האישי, תחת &quot;אוטומציות&quot;.</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </section>
  );
}
