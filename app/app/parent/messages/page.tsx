"use client";

import { useState } from "react";
import { Badge, Card, PageHead } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";

export default function ParentMessages() {
  const { data, profile, actions } = useGanli();
  const [text, setText] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  if (!data || !profile) return null;

  const child = data.children.find((c) => c.id === profile.childId) ?? data.children[0];
  const mine = data.inquiries.filter((q) => !q.childId || q.childId === child.id);
  const absent = child.status === "absent";

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return setMsg({ ok: false, text: "נא לכתוב הודעה" });
    const err = await actions.sendInquiry({ kind: "message", text: text.trim(), childId: child.id });
    setMsg(err ? { ok: false, text: err } : { ok: true, text: "ההודעה נשלחה למנהלת. נענה בהקדם." });
    if (!err) setText("");
  };
  const reportAbsence = async () => {
    const err = await actions.sendInquiry({ kind: "absence", text: `${child.name} לא תגיע היום.`, childId: child.id });
    setMsg(err ? { ok: false, text: err } : { ok: true, text: `דווח: ${child.name} לא בגן היום. הצוות והמנהלת מעודכנים.` });
  };
  const rsvp = (id: string, answer: "yes" | "no") => actions.setRsvp(id, answer).then((err) => err && setMsg({ ok: false, text: err }));

  return (
    <>
      <PageHead kicker="הודעות" title="הודעות מהמשפחתון ואליו" />
      <div className="grid-2">
        <div className="stack">
          {data.announcements.map((a) => (
            <Card key={a.id}>
              <div className="msg">
                <div className="msg-top">
                  <b>{a.title}</b>
                  <time>{a.time}</time>
                </div>
                <p>{a.body}</p>
                {a.needsRead ? (
                  <button type="button" className="mini-btn" onClick={() => actions.markRead(a.id)}>
                    אישור קריאה ✓
                  </button>
                ) : (
                  <Badge tone="ok">נקרא</Badge>
                )}
              </div>
            </Card>
          ))}
          {data.announcements.length === 0 && <Card>אין הודעות חדשות.</Card>}
        </div>

        <div className="stack">
          <Card title="שליחת הודעה למנהלת">
            <form className="event-form" onSubmit={send}>
              <label>
                מה תרצו לשאול או לעדכן?
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="למשל: אאחר באיסוף בעשר דקות" />
              </label>
              {msg && (
                <p className={msg.ok ? "form-ok" : "form-error"} role="status">
                  {msg.text}
                </p>
              )}
              <div className="row-end">
                <button className="btn btn-primary btn-sm">שליחה</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={reportAbsence} disabled={absent}>
                  {absent ? `${child.name} מדווח/ת כנעדר/ת` : `דיווח היעדרות להיום`}
                </button>
              </div>
            </form>
          </Card>

          {mine.length > 0 && (
            <Card title="הפניות שלי">
              <ul className="inquiries">
                {mine.slice(0, 5).map((q) => (
                  <li key={q.id} className={q.done ? "done" : undefined}>
                    <div className="msg-top">
                      <b>{q.kind === "absence" ? "דיווח היעדרות" : "הודעה"}</b>
                      <time>{q.time}</time>
                    </div>
                    <p>{q.text}</p>
                    {q.done ? <Badge tone="ok">טופל</Badge> : <Badge tone="warn">ממתין</Badge>}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card title="בקרוב בגן">
            <ul className="upcoming">
              {data.upcoming.map((u) => (
                <li key={u.id} className="up-row">
                  <span className="date-chip">
                    <small>{u.month}</small>
                    <b>{u.day}</b>
                  </span>
                  <div>
                    <b>{u.title}</b>
                    <span>{u.sub}</span>
                    {u.rsvp && (
                      <div className="rsvp" role="group" aria-label={`אישור הגעה: ${u.title}`}>
                        <button type="button" aria-pressed={u.rsvp.mine === "yes"} className={u.rsvp.mine === "yes" ? "on yes" : undefined} onClick={() => rsvp(u.id, "yes")}>
                          מגיעים ✓
                        </button>
                        <button type="button" aria-pressed={u.rsvp.mine === "no"} className={u.rsvp.mine === "no" ? "on no" : undefined} onClick={() => rsvp(u.id, "no")}>
                          לא מגיעים
                        </button>
                        <small>{u.rsvp.going} משפחות מגיעות</small>
                      </div>
                    )}
                  </div>
                  <Badge tone={u.tone}>{u.tag}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
