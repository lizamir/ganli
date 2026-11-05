import Link from "next/link";
import { Card } from "@/components/dashboard/ui";
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
      <p className="summary-text">{summary}</p>
      <div className="row-end" style={{ marginTop: 14 }}>
        <button
          type="button"
          className="mini-btn"
          onClick={() => {
            const text = `${dayLabel} · ${summary}`;
            if (navigator.share) navigator.share({ text }).catch(() => {});
            else navigator.clipboard?.writeText(text);
          }}
        >
          שיתוף עם המשפחה
        </button>
        <Link href="/app/parent/pickup/" className="mini-btn">
          {planned ? `איסוף: ${planned.who} · ${planned.time}` : "קוד האיסוף להיום"}
        </Link>
      </div>
    </Card>
  );
}
