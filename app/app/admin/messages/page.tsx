"use client";

import { useState } from "react";
import InquiriesCard from "@/components/dashboard/admin/messages/InquiriesCard";
import SentList from "@/components/dashboard/admin/messages/SentList";
import {
  Card,
  PageHead,
  fieldLabel,
  formError,
  formOk,
  formStack,
  grid2,
  stack,
  textInput,
} from "@/components/dashboard/ui";
import { useGanli } from "@/lib/data/GanliProvider";

/** Announcements to parents, and parents' inquiries. */
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
      <div className={grid2}>
        <div className={stack}>
          <Card title="הודעה חדשה לכל ההורים">
            <form className={formStack} onSubmit={send}>
              <label className={fieldLabel}>
                כותרת
                <input
                  className={textInput}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSent(false);
                  }}
                  placeholder="למשל: מחר יום פיג׳מות"
                />
              </label>
              <label className={fieldLabel}>
                תוכן
                <textarea className={textInput} value={body} onChange={(e) => setBody(e.target.value)} rows={3} />
              </label>
              {error && (
                <p className={formError} role="alert">
                  {error}
                </p>
              )}
              {sent && (
                <p className={formOk} role="status">
                  ההודעה נשלחה. אפשר לראות אותה באזור ההורים ✓
                </p>
              )}
              <button className="btn btn-primary justify-center">שליחה</button>
            </form>
          </Card>

          <SentList announcements={data.announcements} />
        </div>

        <InquiriesCard inquiries={data.inquiries} onToggle={actions.setInquiryDone} />
      </div>
    </>
  );
}
