"use client";

import { useState } from "react";
import { Card, MessageHeader } from "@/components/dashboard/ui";
import { waLink } from "@/lib/automations/calendar";
import { hebDate, iso } from "@/lib/automations/schedule";
import { auto } from "@/lib/automations/store";
import type { Signup } from "@/lib/automations/types";
import type { Child } from "@/lib/domain/types";

const signupLabel = "grid gap-1.5 text-[0.9375rem] font-semibold";
const signupInput =
  "min-h-11 rounded-[12px] border-2 border-solid border-sand bg-cream px-3 py-2 text-cocoa-deep [font:inherit]";

/** Sign-up lists: open a new one, see who is missing, and remind the parents' group. */
export default function SignupsCard({ signups, kids }: { signups: Signup[]; kids: Child[] }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  return (
    <Card title="רשימות הרשמה" note="תזכורת למי שעוד לא נרשם" className="[grid-column:1/-1]">
      <form
        className="mb-[18px] grid grid-cols-[1.6fr_1fr_auto] [align-items:end] gap-3 mobile:grid-cols-[1fr]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() || !deadline) return;
          auto.addSignup(title.trim(), deadline);
          setTitle("");
          setDeadline("");
        }}
      >
        <label className={signupLabel}>
          על מה נרשמים?
          <input
            className={signupInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="למשל: הצגה בחנוכה"
          />
        </label>
        <label className={signupLabel}>
          עד מתי
          <input
            className={signupInput}
            type="date"
            value={deadline}
            min={iso(new Date())}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>
        <button className="btn btn-primary btn-sm">פתיחת רשימה</button>
      </form>
      <ul className="m-0 grid list-none gap-3.5 p-0">
        {signups.map((s) => {
          const missing = kids.filter((k) => !s.signed.includes(k.id));
          const text = `תזכורת מגנלי: ההרשמה ל"${s.title}" נסגרת ב${hebDate(s.deadline)}. עוד לא נרשמו: ${missing.map((k) => k.name).join(", ")}. נרשמים באזור האישי.`;
          return (
            <li key={s.id} className="grid justify-items-start gap-2 rounded-[18px] bg-cream px-4 py-3.5">
              <MessageHeader
                title={s.title}
                time={<>נסגר ב{hebDate(s.deadline)}</>}
                className="[justify-self:stretch]"
              />
              <div className="h-2 w-full overflow-hidden rounded-[99px] bg-[#eadcc9]" aria-hidden="true">
                <i
                  className="block h-full rounded-[inherit] bg-teal"
                  style={{ width: `${(s.signed.length / kids.length) * 100}%` }}
                />
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
