import { Disc, miniButton } from "@/components/dashboard/ui";
import type { Announcement } from "@/lib/domain/types";

const noticeText = "text-[0.9375rem] text-[#6b4a14]";

/** The latest announcement from the daycare, with a read confirmation when one is needed. */
export default function NoticeBanner({ notice, onRead }: { notice: Announcement; onRead: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3.5 rounded-[22px] bg-mustard-soft px-[18px] py-4">
      <Disc icon="bell" color="var(--mustard)" className={noticeText} />
      <div className="grid flex-1">
        <b className="font-heading text-[1.0625rem]/[normal] font-semibold text-[#4a3300]">מהמשפחתון: {notice.title}</b>
        <span className={noticeText}>{notice.body}</span>
      </div>
      {notice.needsRead && (
        <button type="button" className={miniButton} onClick={() => onRead(notice.id)}>
          קראתי ✓
        </button>
      )}
    </div>
  );
}
