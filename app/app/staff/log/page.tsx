"use client";

import EventForm from "@/components/dashboard/care/EventForm";
import { Card, Disc, PageHead } from "@/components/dashboard/ui";
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
      <div className="grid-log">
        <Card title="עדכון חדש">
          <EventForm />
        </Card>
        <Card title="עדכונים אחרונים">
          <ul className="timeline-list">
            {recent.map((e) => (
              <li key={e.id}>
                <Disc icon={KIND[e.kind].icon} color={KIND[e.kind].color} size={34} />
                <div>
                  <b>
                    {name(e.childId)} · {e.title}
                  </b>
                  <span>
                    {e.detail}
                    {e.by ? ` · ${e.by}` : ""}
                  </span>
                </div>
                <time>{e.end ?? e.start}</time>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
