import DayRibbon from "@/components/dashboard/care/DayRibbon";
import { KIND } from "@/components/dashboard/care/careKinds";
import { Card, Disc } from "@/components/dashboard/ui";
import type { CareEvent, Child } from "@/lib/domain/types";

type Props = { child: Child; events: CareEvent[]; now: string; selected: string; onSelect: (id: string) => void };

/** The day as a strip of events. Selecting one shows its details underneath. */
export default function DayStripCard({ child, events, now, selected, onSelect }: Props) {
  const ev = events.find((e) => e.id === selected);
  return (
    <Card title="איך עובר היום" note="לחצו על הפס לפרטים" className="span-2">
      <DayRibbon arrival={child.arrival} now={now} events={events} selectedId={selected} onSelect={onSelect} />
      <div className="ribbon-detail" aria-live="polite">
        {ev ? (
          <>
            <Disc icon={KIND[ev.kind].icon} color={KIND[ev.kind].color} />
            <div>
              <b>{ev.title}</b>
              <span>
                {ev.start}
                {ev.end ? `–${ev.end}` : ""} · {ev.detail}
                {ev.by ? ` · עודכן על ידי ${ev.by}` : ""}
              </span>
            </div>
            {ev.amount != null && (
              <span
                className="plate"
                style={{ "--fill": `${ev.amount * 100}%` } as React.CSSProperties}
                aria-label={`אכלה ${Math.round(ev.amount * 100)}%`}
              />
            )}
          </>
        ) : (
          <>
            <Disc icon="foot" color={KIND.arrival.color} />
            <div>
              <b>הגיעה {child.arrival ?? "—"}</b>
              <span>איסוף צפוי {child.pickup ?? "—"}</span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
