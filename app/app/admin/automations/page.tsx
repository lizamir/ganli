"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Card, Empty, PageHead } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";
import { AUTOMATIONS, auto, downloadIcs, googleCalendarLink, hebDate, iso, useAutomations, waLink } from "@/lib/app/automations";

/** The director's automation hub: what runs by itself, meetings that were booked, sign-up lists with reminders, and a log. */
export default function AdminAutomations() {
  const { data } = useGanli();
  const a = useAutomations();
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  if (!data) return null;

  const kids = data.children;
  const upcoming = [...a.bookings].sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time));

  return (
    <>
      <PageHead kicker="אוטומציות" title="מה קורה לבד בגן" actions={<Badge tone="ok">{Object.values(a.on).filter(Boolean).length} פעילות</Badge>} />

      <div className="auto-grid">
        <Card title="אוטומציות" note="מה מפעיל ומה קורה">
          <ul className="auto-list">
            {AUTOMATIONS.map((x) => (
              <li key={x.id}>
                <div>
                  <b>{x.trigger}</b>
                  <span>{x.action}</span>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={!!a.on[x.id]} onChange={() => auto.toggle(x.id)} />
                  <span aria-hidden="true" />
                  <span className="sr-only">{x.trigger}</span>
                </label>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="פגישות שנקבעו" note="מהאתר, עם זימון ליומן">
          {upcoming.length === 0 ? (
            <Empty>
              עוד אין פגישות. הורים קובעים פגישה דרך <Link href="/#meet">&quot;פגישה עם המנהלת&quot; באתר</Link>, והיא מופיעה כאן.
            </Empty>
          ) : (
            <ul className="inquiries">
              {upcoming.map((b) => (
                <li key={b.id}>
                  <div className="msg-top">
                    <b>{b.name}</b>
                    <time>
                      {hebDate(b.date)} · {b.time}
                    </time>
                  </div>
                  <p>{b.topic}</p>
                  <div className="row-actions">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => downloadIcs(b)}>
                      זימון (.ics)
                    </button>
                    <a className="btn btn-ghost btn-sm" href={googleCalendarLink(b)} target="_blank" rel="noreferrer">
                      יומן גוגל
                    </a>
                    <a
                      className="btn btn-wa btn-sm"
                      href={waLink(`היי ${b.name}, תזכורת לפגישה בגנלי ${hebDate(b.date)} ב‑${b.time}. נתראה!`, b.phone.replace(/\D/g, "").replace(/^0/, "972"))}
                      target="_blank"
                      rel="noreferrer"
                    >
                      תזכורת בוואטסאפ
                    </a>
                    <button type="button" className="link-btn" onClick={() => auto.cancel(b.id)}>
                      ביטול
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

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
            {a.signups.map((s) => {
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
                    {s.signed.length} מתוך {kids.length} נרשמו{missing.length ? ` · חסרים: ${missing.map((k) => k.name).join(", ")}` : " · כולם נרשמו"}
                  </p>
                  {missing.length > 0 && (
                    <a className="btn btn-wa btn-sm" href={waLink(text)} target="_blank" rel="noreferrer" onClick={() => auto.note(`נשלחה תזכורת הרשמה: ${s.title}`)}>
                      שליחת תזכורת לקבוצת ההורים
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="יומן פעולות" note="מה קרה לאחרונה" className="span-2">
          {a.log.length === 0 ? (
            <Empty>עוד לא קרה כלום. קבעו פגישה באתר או השאירו פנייה, ותראו את זה כאן.</Empty>
          ) : (
            <ol className="auto-log">
              {a.log.map((l) => (
                <li key={l.id}>
                  <time>{l.at}</time>
                  <span>{l.text}</span>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
      <p className="hint-line">
        מה עובד כאן באמת: זימונים ליומן, קישורים ליומן גוגל, והודעות וואטסאפ שנפתחות מוכנות לשליחה. שליחה אוטומטית לגמרי, בלי לחיצה, דורשת חיבור ל‑WhatsApp Business API (למשל דרך n8n), וזה השלב הבא.
      </p>
    </>
  );
}
