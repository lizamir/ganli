import Link from "next/link";
import { Card } from "@/components/dashboard/ui";
import { openAmount, paymentBreakdown } from "@/lib/domain/finance";
import { shekel } from "@/lib/format";
import type { GanliSnapshot } from "@/lib/domain/types";
import { cn } from "@/lib/ui/cn";
import { TONE_CLASS } from "@/lib/ui/tones";

const payTile = "grid rounded-[16px] p-3.5";
const payLabel = "font-heading text-[0.875rem]/[normal] font-semibold";

/** This month's payments as a bar and three totals. */
export default function PaymentsCard({ data }: { data: GanliSnapshot }) {
  const { paid, pending, late } = paymentBreakdown(data.charges, data.currentPeriod);
  const billed = paid.reduce((s, c) => s + c.amount, 0);
  return (
    <Card title={`תשלומים · ${data.currentPeriod}`} note={<Link href="/app/admin/finance/">לכל הכספים ←</Link>}>
      <div
        className="flex h-4 gap-[3px] overflow-hidden rounded-[8px]"
        role="img"
        aria-label={`${paid.length} שולמו, ${pending.length} ממתינים, ${late.length} באיחור`}
      >
        <span style={{ flex: paid.length, background: "#5fb59a" }} />
        <span style={{ flex: pending.length, background: "var(--mustard)" }} />
        <span style={{ flex: late.length, background: "var(--tomato)" }} />
      </div>
      <div className="mt-3.5 grid grid-cols-[repeat(3,1fr)] gap-2.5">
        <div className={cn(payTile, TONE_CLASS.ok)}>
          <b className="font-heading text-[1.75rem]/none font-bold">{paid.length}</b>
          <span className={payLabel}>שולם</span>
          <small className="text-[0.8125rem]">{shekel(billed)}</small>
        </div>
        <div className={cn(payTile, TONE_CLASS.warn)}>
          <b className="font-heading text-[1.75rem]/none font-bold">{pending.length}</b>
          <span className={payLabel}>ממתין</span>
          <small className="text-[0.8125rem]">{shekel(openAmount(pending))}</small>
        </div>
        <div className={cn(payTile, TONE_CLASS.bad)}>
          <b className="font-heading text-[1.75rem]/none font-bold">{late.length}</b>
          <span className={payLabel}>באיחור</span>
          <small className="text-[0.8125rem]">{shekel(openAmount(late))}</small>
        </div>
      </div>
    </Card>
  );
}
