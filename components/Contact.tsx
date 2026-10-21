"use client";

import { useId, useState } from "react";
import { CONTACT, GROUPS } from "@/lib/content";
import { useGanli } from "@/lib/app/store";
import { auto } from "@/lib/app/automations";
import { LogoMark, Star } from "./Shapes";

export default function Contact() {
  const { submitLead } = useGanli();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const id = useId();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    const err = await submitLead({
      parent: String(f.get("parent") || "").trim(),
      phone: String(f.get("phone") || "").trim(),
      child: String(f.get("child") || "").trim(),
      group: String(f.get("group") || ""),
      message: String(f.get("message") || "").trim(),
    });
    setBusy(false);
    if (err) setError(err);
    else {
      setSent(true);
      auto.note(`פנייה חדשה מהאתר: ${String(f.get("parent") || "").trim()}. הפנייה נכנסה לרשימת ההרשמות.`);
    }
  };

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact-card">
          <div className="contact-copy reveal">
            <p className="eyebrow">
              <b>(08)</b> בואו להכיר
            </p>
            <h2 id="contact-title" className="title">
              מוזמנים לסיור
              <br />
              <span className="serif">בבית השני</span> שלנו.
            </h2>
            <p className="lead">השאירו פרטים ונחזור אליכם לתיאום ביקור בגן. בסיור תכירו את הצוות, את המרחבים ואת האפליקציה.</p>
            <ul className="contact-info">
              <li>
                <i aria-hidden="true">☎</i>
                <a href={CONTACT.phoneHref}>
                  <bdi>{CONTACT.phone}</bdi>
                </a>
              </li>
              <li>
                <i aria-hidden="true">⌂</i>
                <span>{CONTACT.address}</span>
              </li>
              <li>
                <i aria-hidden="true">◷</i>
                <span>{CONTACT.hours}</span>
              </li>
            </ul>
          </div>

          <form className="form reveal" onSubmit={onSubmit} aria-labelledby={`${id}-t`} style={{ ["--d" as string]: 2 }}>
            {sent ? (
              <div className="form-success" role="status">
                <Star color="var(--mustard)" />
                <h3>תודה! קיבלנו את הפרטים</h3>
                <p>נחזור אליכם בהקדם לתיאום סיור בגן.</p>
              </div>
            ) : (
              <>
                <h3 id={`${id}-t`}>תיאום סיור והרשמה</h3>
                <div className="row">
                  <label>
                    שם ההורה
                    <input name="parent" required autoComplete="name" />
                  </label>
                  <label>
                    טלפון
                    <input name="phone" type="tel" required autoComplete="tel" dir="ltr" inputMode="tel" />
                  </label>
                </div>
                <div className="row">
                  <label>
                    שם הילד/ה
                    <input name="child" autoComplete="off" />
                  </label>
                  <label>
                    קבוצת גיל
                    <select name="group" defaultValue="">
                      <option value="" disabled>
                        בחרו קבוצה
                      </option>
                      {GROUPS.map((g) => (
                        <option key={g.name} value={g.name}>
                          {g.name} · {g.ages}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  משהו שחשוב לכם שנדע?
                  <textarea name="message" rows={3} />
                </label>
                <label className="consent">
                  <input type="checkbox" required />
                  <span>אני מאשרת/ת שיצרו איתי קשר בנוגע לסיור ולהרשמה</span>
                </label>
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <button className="btn btn-primary" disabled={busy}>
                  {busy ? "שולחים…" : "שליחה ←"}
                </button>
                <p className="form-note">זו גרסת הדגמה: הפרטים נשמרים רק בדפדפן הזה, ומופיעים למנהלת באזור האישי שבדמו.</p>
              </>
            )}
          </form>
          <LogoMark className="contact-deco" />
        </div>
      </div>
    </section>
  );
}
