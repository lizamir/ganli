import { Disc } from "@/components/dashboard/ui";
import type { Announcement } from "@/lib/domain/types";

/** The latest announcement from the daycare, with a read confirmation when one is needed. */
export default function NoticeBanner({ notice, onRead }: { notice: Announcement; onRead: (id: string) => void }) {
  return (
    <div className="notice">
      <Disc icon="bell" color="var(--mustard)" />
      <div>
        <b>מהמשפחתון: {notice.title}</b>
        <span>{notice.body}</span>
      </div>
      {notice.needsRead && (
        <button type="button" className="mini-btn" onClick={() => onRead(notice.id)}>
          קראתי ✓
        </button>
      )}
    </div>
  );
}
