"use client";

import { useState } from "react";
import { Card } from "@/components/dashboard/ui";
import { waLink } from "@/lib/automations/calendar";
import { hebDate, iso } from "@/lib/automations/schedule";
import { auto } from "@/lib/automations/store";
import type { Signup } from "@/lib/automations/types";
import type { Child } from "@/lib/domain/types";

/** Sign-up lists: open a new one, see who is missing, and remind the parents' group. */
export default function SignupsCard({ signups, kids }: { signups: Signup[]; kids: Child[] }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  return (
    <Card title="רשימות הרשמה" note="תזכורת למי שעוד לא נרשם" className="span-2">
      <form
        className="signup-new"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() || !deadline) return;
          auto.addSignup(title.trim(), deadline);
          setTitle("");
          setDeadline("");
        }}
      >
        <label>
          על מה נרשמים?
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="למשל: הצגה בחנוכה" />
        </label>
        <label>
          עד מתי
          <input type="date" value={deadline} min={iso(new Date())} onChange={(e) => setDeadline(e.target.value)} />
        </label>
        <button className="btn btn-primary btn-sm">פתיחת רשימה</button>
      </form>
      <ul className="signups">
        {signups.map((s) => {
          const missing = kids.filter((k) => !s.signed.includes(k.id));
          const text = `תזכורת מגנלי: ההרשמה ל"${s.title}" נסגרת ב${hebDate(s.deadline)}. עוד לא נרשמו: ${missing.map((k) => k.name).join(", ")}. נרשמים באזור האישי.`;
          return (
            <li key={s.id}>
              <div className="msg-top">
                <b>{s.title}</b>
                <time>נסגר ב{hebDate(s.deadline)}</time>
              </div>
              <div className="meter" aria-hidden="true">
                <i style={{ width: `${(s.signed.length / kids.length) * 100}%` }} />
              </div>
              <p>
                {s.signed.length} מתוך {kids.length} נרשמו
                {missing.length ? ` · חסרים: ${missing.map((k) => k.name).join(", ")}` : " · כולם נרשמו"}
              </p>
              {missing.length > 0 && (
                <a
                  className="btn btn-wa btn-sm"
                  href={waLink(text)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => auto.note(`נשלחה תזכורת הרשמה: ${s.title}`)}
                >
                  שליחת תזכורת לקבוצת ההורים
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
