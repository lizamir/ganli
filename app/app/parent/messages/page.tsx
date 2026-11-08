"use client";

import { useState } from "react";
import AnnouncementList from "@/components/dashboard/parent/messages/AnnouncementList";
import MessageCard from "@/components/dashboard/parent/messages/MessageCard";
import MyInquiries from "@/components/dashboard/parent/messages/MyInquiries";
import UpcomingRsvp from "@/components/dashboard/parent/messages/UpcomingRsvp";
import { PageHead, grid2, stack } from "@/components/dashboard/ui";
import { useGanli } from "@/lib/data/GanliProvider";

/** Messages between the parent and the daycare, and event answers. */
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
    setMsg(
      err ? { ok: false, text: err } : { ok: true, text: `דווח: ${child.name} לא בגן היום. הצוות והמנהלת מעודכנים.` },
    );
  };
  const rsvp = (id: string, answer: "yes" | "no") =>
    actions.setRsvp(id, answer).then((err) => err && setMsg({ ok: false, text: err }));

  return (
    <>
      <PageHead kicker="הודעות" title="הודעות מהמשפחתון ואליו" />
      <div className={grid2}>
        <div className={stack}>
          <AnnouncementList announcements={data.announcements} onRead={actions.markRead} />
        </div>

        <div className={stack}>
          <MessageCard
            text={text}
            onText={setText}
            onSend={send}
            onAbsence={reportAbsence}
            absent={absent}
            childName={child.name}
            msg={msg}
          />
          {mine.length > 0 && <MyInquiries mine={mine} />}
          <UpcomingRsvp upcoming={data.upcoming} onRsvp={rsvp} />
        </div>
      </div>
    </>
  );
}
