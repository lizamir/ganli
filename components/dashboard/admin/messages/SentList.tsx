import { Card, plainList } from "@/components/dashboard/ui";
import type { Announcement } from "@/lib/domain/types";
import { cn } from "@/lib/ui/cn";

const sentSmall = "text-[0.8125rem] text-subtle";
/** Every row keeps its dashed line, the last one too. */
const dashedRowBottom = "[border-bottom:1px_dashed_#eadfce]";

/** Announcements already sent, with how many parents read each. */
export default function SentList({ announcements }: { announcements: Announcement[] }) {
  return (
    <Card title="הודעות שנשלחו">
      <ul className={cn(plainList, "gap-1")}>
        {announcements.map((a) => (
          <li key={a.id} className={`flex items-center justify-between gap-4 py-2.5 ${dashedRowBottom}`}>
            <div className="grid">
              <b className="font-heading text-[1rem]/[normal] font-semibold">{a.title}</b>
              <span className={sentSmall}>{a.time}</span>
            </div>
            {a.of > 0 && (
              <span
                className={cn(
                  sentSmall,
                  "grid w-[120px] justify-items-end gap-1 before:h-2 before:w-full before:rounded-[4px] before:bg-sand before:content-[''] before:[grid-area:1/1]",
                )}
                aria-label={`נקראה על ידי ${a.readBy} מתוך ${a.of}`}
              >
                <i
                  className="h-2 [justify-self:start] rounded-[4px] bg-teal [grid-area:1/1]"
                  style={{ width: `${(a.readBy / a.of) * 100}%` }}
                />
                <small className="text-[0.75rem] text-subtle">
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
