import Link from "next/link";
import { Card, miniButton, rowEnds } from "@/components/dashboard/ui";
import { cn } from "@/lib/ui/cn";
import type { PlannedPickup } from "@/lib/domain/types";

/** The automatic day summary, with sharing and a shortcut to today's pickup. */
export default function SummaryCard({
  summary,
  dayLabel,
  planned,
}: {
  summary: string;
  dayLabel: string;
  planned?: PlannedPickup;
}) {
  return (
    <Card title="סיכום היום" note="נבנה אוטומטית מהיומן" tint="var(--teal-soft)">
      <p className="font-heading text-[1.3rem]/[1.55] font-bold text-cocoa-deep">{summary}</p>
      <div className={cn(rowEnds, "mt-3.5")}>
        <button
          type="button"
          className={miniButton}
          onClick={() => {
            const text = `${dayLabel} · ${summary}`;
            if (navigator.share) navigator.share({ text }).catch(() => {});
            else navigator.clipboard?.writeText(text);
          }}
        >
          שיתוף עם המשפחה
        </button>
        <Link href="/app/parent/pickup/" className={miniButton}>
          {planned ? `איסוף: ${planned.who} · ${planned.time}` : "קוד האיסוף להיום"}
        </Link>
      </div>
    </Card>
  );
}
