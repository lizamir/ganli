"use client";

import { useState } from "react";
import { Badge, Card, PageHead } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";

export default function AdminMessages() {
  const { data, actions } = useGanli();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  if (!data) return null;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError("נא לכתוב כותרת");
    const err = await actions.addAnnouncement(title.trim(), body.trim());
    setError(err);
    if (!err) {
      setTitle("");
      setBody("");
      setSent(true);
    }
  };

  return (
    <>
      <PageHead kicker="הודעות" title="הודעות ופניות" />
      <div className="grid-2">
        <div className="stack">
          <Card title="הודעה חדשה לכל ההורים">
            <form className="event-form" onSubmit={send}>
              <label>
                כותרת
                <input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSent(false);
                  }}
                  placeholder="למשל: מחר יום פיג׳מות"
                />
              </label>
              <label>
                תוכן
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} />
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              {sent && (
                <p className="form-ok" role="status">
                  ההודעה נשלחה. אפשר לראות אותה באזור ההורים ✓
                </p>
              )}
              <button className="btn btn-primary">שליחה</button>
            </form>
          </Card>

          <Card title="הודעות שנשלחו">
            <ul className="sent-list">
              {data.announcements.map((a) => (
                <li key={a.id}>
                  <div>
                    <b>{a.title}</b>
                    <span>{a.time}</span>
                  </div>
                  {a.of > 0 && (
                    <span className="read-meter" aria-label={`נקראה על ידי ${a.readBy} מתוך ${a.of}`}>
                      <i style={{ width: `${(a.readBy / a.of) * 100}%` }} />
                      <small>
                        {a.readBy}/{a.of} קראו
                      </small>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card title="פניות מהורים" note={`${data.inquiries.filter((q) => !q.done).length} פתוחות`}>
          <ul className="inquiries">
            {data.inquiries.map((q) => (
              <li key={q.id} className={q.done ? "done" : undefined}>
                <div className="msg-top">
                  <b>{q.from}</b>
                  <time>{q.time}</time>
                </div>
                {q.kind === "absence" && <Badge tone="cool">דיווח היעדרות</Badge>}
                <p>{q.text}</p>
                <div className="row-end">
                  {q.done ? <Badge tone="ok">טופל</Badge> : <Badge tone="warn">ממתין</Badge>}
                  <button type="button" className="mini-btn" onClick={() => actions.setInquiryDone(q.id, !q.done)}>
                    {q.done ? "החזרה לפתוח" : "סימון כטופל"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
