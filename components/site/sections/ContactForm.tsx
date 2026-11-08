"use client";

import { useId, useState } from "react";
import { Star } from "@/components/common/Shapes";
import { GROUPS } from "@/content";
import { auto } from "@/lib/automations/store";
import { useGanli } from "@/lib/data/GanliProvider";
import { formError } from "@/components/dashboard/ui/form";
import { cn } from "@/lib/ui/cn";
import {
  consentBox,
  consentLabel,
  formButton,
  formField,
  formLabel,
  formNote,
  formPanel,
  formRow,
  formTextarea,
  formTitle,
} from "@/components/site/form";

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
    <form
      className={cn(formPanel, "reveal")}
      onSubmit={onSubmit}
      aria-labelledby={`${id}-t`}
      style={{ ["--d" as string]: 2 }}
    >
      {sent ? (
        <div
          className="grid justify-items-center gap-[14px] px-[10px] py-10 text-center [&_svg]:w-[100px] [&_svg]:animate-[bob_2.4s_ease-in-out_infinite]"
          role="status"
        >
          <Star color="var(--mustard)" />
          <h3 className={formTitle}>תודה! קיבלנו את הפרטים</h3>
          <p>נחזור אליכם בהקדם לתיאום סיור בגן.</p>
        </div>
      ) : (
        <>
          <h3 id={`${id}-t`} className={formTitle}>
            תיאום סיור והרשמה
          </h3>
          <div className={formRow}>
            <label className={formLabel}>
              שם ההורה
              <input className={formField} name="parent" required autoComplete="name" />
            </label>
            <label className={formLabel}>
              טלפון
              <input
                className={formField}
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                dir="ltr"
                inputMode="tel"
              />
            </label>
          </div>
          <div className={formRow}>
            <label className={formLabel}>
              שם הילד/ה
              <input className={formField} name="child" autoComplete="off" />
            </label>
            <label className={formLabel}>
              קבוצת גיל
              <select className={formField} name="group" defaultValue="">
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
          <label className={formLabel}>
            משהו שחשוב לכם שנדע?
            <textarea name="message" rows={3} className={formTextarea} />
          </label>
          <label className={consentLabel}>
            <input type="checkbox" required className={consentBox} />
            <span>אני מאשרת/ת שיצרו איתי קשר בנוגע לסיור ולהרשמה</span>
          </label>
          {error && (
            <p className={formError} role="alert">
              {error}
            </p>
          )}
          <button className={cn("btn btn-primary", formButton)} disabled={busy}>
            {busy ? "שולחים…" : "שליחה ←"}
          </button>
          <p className={formNote}>זו גרסת הדגמה: הפרטים נשמרים רק בדפדפן הזה, ומופיעים למנהלת באזור האישי שבדמו.</p>
        </>
      )}
    </form>
  );
}
