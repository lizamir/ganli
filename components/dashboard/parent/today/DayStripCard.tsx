import DayRibbon from "@/components/dashboard/care/DayRibbon";
import { KIND } from "@/components/dashboard/care/careKinds";
import { Card, Disc } from "@/components/dashboard/ui";
import type { CareEvent, Child } from "@/lib/domain/types";

const detailTitle = "font-heading text-[1.0625rem]/[normal] font-semibold";
const detailText = "text-[0.9375rem] text-subtle";

type Props = { child: Child; events: CareEvent[]; now: string; selected: string; onSelect: (id: string) => void };

/** The day as a strip of events. Selecting one shows its details underneath. */
export default function DayStripCard({ child, events, now, selected, onSelect }: Props) {
  const ev = events.find((e) => e.id === selected);
  return (
    <Card title="איך עובר היום" note="לחצו על הפס לפרטים" className="[grid-column:span_1]">
      <DayRibbon arrival={child.arrival} now={now} events={events} selectedId={selected} onSelect={onSelect} />
      <div className="mt-4 flex items-center gap-3.5 rounded-[18px] bg-app p-3.5" aria-live="polite">
        {ev ? (
          <>
            <Disc icon={KIND[ev.kind].icon} color={KIND[ev.kind].color} className={detailText} />
            <div className="grid flex-1">
              <b className={detailTitle}>{ev.title}</b>
              <span className={detailText}>
                {ev.start}
                {ev.end ? `–${ev.end}` : ""} · {ev.detail}
                {ev.by ? ` · עודכן על ידי ${ev.by}` : ""}
              </span>
            </div>
            {ev.amount != null && (
              <span
                className={`size-[52px] flex-none rounded-[50%] bg-[conic-gradient(var(--mustard)_var(--fill),#fff_0)] shadow-[inset_0_0_0_6px_#fff,0_0_0_2px_var(--wood)] ${detailText}`}
                style={{ "--fill": `${ev.amount * 100}%` } as React.CSSProperties}
                aria-label={`אכלה ${Math.round(ev.amount * 100)}%`}
              />
            )}
          </>
        ) : (
          <>
            <Disc icon="foot" color={KIND.arrival.color} className={detailText} />
            <div className="grid flex-1">
              <b className={detailTitle}>הגיעה {child.arrival ?? "—"}</b>
              <span className={detailText}>איסוף צפוי {child.pickup ?? "—"}</span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
