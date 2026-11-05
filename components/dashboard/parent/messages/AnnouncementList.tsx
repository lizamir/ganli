import { Badge, Card } from "@/components/dashboard/ui";
import type { Announcement } from "@/lib/domain/types";

/** Announcements from the daycare, each with a read confirmation. */
export default function AnnouncementList({
  announcements,
  onRead,
}: {
  announcements: Announcement[];
  onRead: (id: string) => void;
}) {
  return (
    <>
      {announcements.map((a) => (
        <Card key={a.id}>
          <div className="msg">
            <div className="msg-top">
              <b>{a.title}</b>
              <time>{a.time}</time>
            </div>
            <p>{a.body}</p>
            {a.needsRead ? (
              <button type="button" className="mini-btn" onClick={() => onRead(a.id)}>
                אישור קריאה ✓
              </button>
            ) : (
              <Badge tone="ok">נקרא</Badge>
            )}
          </div>
        </Card>
      ))}
      {announcements.length === 0 && <Card>אין הודעות חדשות.</Card>}
    </>
  );
}
