"use client";

import { auto, hebDate, useAutomations } from "@/lib/app/automations";

/** The "bot" that tells a parent there is an urgent sign-up list waiting, with a one-tap answer. */
export default function SignupNotice({ childId, childName }: { childId: string; childName: string }) {
  const { signups } = useAutomations();
  const open = signups.filter((s) => !s.signed.includes(childId));
  const done = signups.filter((s) => s.signed.includes(childId));
  if (!signups.length) return null;
  return (
    <div className="signup-notice" role="region" aria-label="הרשמות פתוחות">
      {open.map((s) => (
        <div className="sn-item sn-open" key={s.id}>
          <span className="sn-bot" aria-hidden="true">🔔</span>
          <p>
            <b>צריך להירשם:</b> {s.title}. ההרשמה נסגרת ב{hebDate(s.deadline)}.
          </p>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => auto.sign(s.id, childId, childName, true)}>
            לרשום את {childName}
          </button>
        </div>
      ))}
      {done.map((s) => (
        <div className="sn-item" key={s.id}>
          <span className="sn-bot" aria-hidden="true">✓</span>
          <p>
            נרשמתם ל{s.title} ✓
          </p>
          <button type="button" className="link-btn" onClick={() => auto.sign(s.id, childId, childName, false)}>
            ביטול הרשמה
          </button>
        </div>
      ))}
    </div>
  );
}
