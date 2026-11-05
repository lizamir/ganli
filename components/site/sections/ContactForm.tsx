"use client";

import { useId, useState } from "react";
import { Star } from "@/components/common/Shapes";
import { GROUPS } from "@/content";
import { auto } from "@/lib/automations/store";
import { useGanli } from "@/lib/data/GanliProvider";

/** The tour and enrollment form. It saves a request for the director and shows a thank-you. */
export default function ContactForm() {
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
  );
}
