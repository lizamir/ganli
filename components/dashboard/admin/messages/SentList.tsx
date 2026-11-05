import { Card } from "@/components/dashboard/ui";
import type { Announcement } from "@/lib/domain/types";

/** Announcements already sent, with how many parents read each. */
export default function SentList({ announcements }: { announcements: Announcement[] }) {
  return (
    <Card title="הודעות שנשלחו">
      <ul className="sent-list">
        {announcements.map((a) => (
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
  );
}
