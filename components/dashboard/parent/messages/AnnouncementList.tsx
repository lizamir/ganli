import { Badge, Card, MessageHeader, miniButton } from "@/components/dashboard/ui";
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
          <div className="grid justify-items-start gap-2">
            <MessageHeader title={a.title} time={a.time} />
            <p className="text-[#6f5d52]">{a.body}</p>
            {a.needsRead ? (
              <button type="button" className={miniButton} onClick={() => onRead(a.id)}>
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
