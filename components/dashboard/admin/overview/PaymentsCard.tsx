import Link from "next/link";
import { Card } from "@/components/dashboard/ui";
import { openAmount, paymentBreakdown } from "@/lib/domain/finance";
import { shekel } from "@/lib/format";
import type { GanliSnapshot } from "@/lib/domain/types";

/** This month's payments as a bar and three totals. */
export default function PaymentsCard({ data }: { data: GanliSnapshot }) {
  const { paid, pending, late } = paymentBreakdown(data.charges, data.currentPeriod);
  const billed = paid.reduce((s, c) => s + c.amount, 0);
  return (
    <Card title={`תשלומים · ${data.currentPeriod}`} note={<Link href="/app/admin/finance/">לכל הכספים ←</Link>}>
      <div
        className="paybar"
        role="img"
        aria-label={`${paid.length} שולמו, ${pending.length} ממתינים, ${late.length} באיחור`}
      >
        <span style={{ flex: paid.length, background: "#5fb59a" }} />
        <span style={{ flex: pending.length, background: "var(--mustard)" }} />
        <span style={{ flex: late.length, background: "var(--tomato)" }} />
      </div>
      <div className="pay-tiles">
        <div className="tone-ok">
          <b>{paid.length}</b>
          <span>שולם</span>
          <small>{shekel(billed)}</small>
        </div>
        <div className="tone-warn">
          <b>{pending.length}</b>
          <span>ממתין</span>
          <small>{shekel(openAmount(pending))}</small>
        </div>
        <div className="tone-bad">
          <b>{late.length}</b>
          <span>באיחור</span>
          <small>{shekel(openAmount(late))}</small>
        </div>
      </div>
    </Card>
  );
}
