"use client";

import EventForm from "@/components/dashboard/care/EventForm";
import {
  Card,
  Disc,
  PageHead,
  gridLog,
  inSmallText,
  plainList,
  timelineDetail,
  timelineItem,
  timelineTime,
  timelineTitle,
} from "@/components/dashboard/ui";
import { KIND } from "@/components/dashboard/care/careKinds";
import { useGanli } from "@/lib/data/GanliProvider";

/** Log a care event, and see the latest ones. */
export default function StaffLog() {
  const { data } = useGanli();
  if (!data) return null;
  const name = (id: string) => data.children.find((c) => c.id === id)?.name ?? "";
  const recent = [...data.events].sort((a, b) => (b.end ?? b.start).localeCompare(a.end ?? a.start)).slice(0, 12);

  return (
    <>
      <PageHead kicker="יומן טיפול" title="עדכון יומן" />
      <div className={gridLog}>
        <Card title="עדכון חדש">
          <EventForm />
        </Card>
        <Card title="עדכונים אחרונים">
          <ul className={plainList}>
            {recent.map((e) => (
              <li key={e.id} className={timelineItem}>
                <Disc icon={KIND[e.kind].icon} color={KIND[e.kind].color} size={34} className={inSmallText} />
                <div className="grid flex-1">
                  <b className={timelineTitle}>
                    {name(e.childId)} · {e.title}
                  </b>
                  <span className={timelineDetail}>
                    {e.detail}
                    {e.by ? ` · ${e.by}` : ""}
                  </span>
                </div>
                <time className={timelineTime}>{e.end ?? e.start}</time>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
