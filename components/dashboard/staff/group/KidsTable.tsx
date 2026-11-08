import DayRibbon from "@/components/dashboard/care/DayRibbon";
import { Avatar, Badge, Card } from "@/components/dashboard/ui";
import { lastUpdate, STALE_MINUTES } from "@/lib/domain/care";
import type { Child, GanliSnapshot } from "@/lib/domain/types";
import { cn } from "@/lib/ui/cn";

const kidRow =
  "grid grid-cols-[28px_150px_1fr_120px_170px] items-center gap-4 px-3 py-2.5 mobile:grid-cols-[24px_1fr_auto] rounded-[16px] transition-[background] duration-200 ease-[ease]";
const kidName = "font-heading text-[1.0625rem]/[normal] font-semibold";
const kidLast = "text-[0.875rem] text-subtle";
/** On phones the day strip and the last update take the full width under the name. */
const stretchOnPhone = "mobile:[grid-column:2/-1]";

type Props = {
  data: GanliSnapshot;
  present: Child[];
  collected: Child[];
  absent: Child[];
  picked: string[];
  staleness: (id: string) => number;
  onToggle: (id: string) => void;
};

/** The group board: one row per child, with their day so far and their status. */
export default function KidsTable({ data, present, collected, absent, picked, staleness, onToggle }: Props) {
  return (
    <Card title="הילדים היום" note="סמנו כמה ילדים לעדכון קבוצתי">
      <div className="grid" role="list">
        <div
          className="grid grid-cols-[28px_150px_1fr_120px_170px] items-center gap-4 px-3 py-2.5 font-heading text-[0.8125rem]/[normal] font-semibold text-subtle mobile:hidden"
          aria-hidden="true"
        >
          <span />
          <span>ילד</span>
          <span>היום עד עכשיו</span>
          <span>עדכון אחרון</span>
          <span>מצב</span>
        </div>
        {present.map((c) => {
          const events = data.events.filter((e) => e.childId === c.id);
          const mins = staleness(c.id);
          const isPicked = picked.includes(c.id);
          return (
            <div key={c.id} role="listitem" className={cn(kidRow, isPicked ? "bg-teal-soft" : "hover:bg-[#faf5ec]")}>
              <input
                type="checkbox"
                className="size-5 accent-teal-deep"
                checked={isPicked}
                onChange={() => onToggle(c.id)}
                aria-label={`בחירת ${c.name}`}
              />
              <span className="flex items-center gap-2.5">
                <Avatar name={c.name} color={c.color} size={36} />
                <b className={kidName}>{c.name}</b>
              </span>
              <DayRibbon compact arrival={c.arrival} now={data.now} events={events} className={stretchOnPhone} />
              <span className={cn(kidLast, stretchOnPhone)}>
                {lastUpdate(data.events, c.id) ?? `הגעה ${c.arrival}`}
              </span>
              <span>
                {mins >= STALE_MINUTES ? (
                  <Badge tone="warn">אין עדכון {Math.floor(mins / 60)} שעות</Badge>
                ) : c.flag ? (
                  <Badge tone={c.flag.tone}>{c.flag.text}</Badge>
                ) : (
                  <Badge tone="ok">נוכח/ת</Badge>
                )}
              </span>
            </div>
          );
        })}
        {collected.map((c) => (
          <div key={c.id} role="listitem" className={cn(kidRow, "bg-[#f3ebdf]")}>
            <span />
            <span className="flex items-center gap-2.5">
              <Avatar name={c.name} color={c.color} size={36} dim />
              <b className={cn(kidName, "text-muted")}>{c.name}</b>
            </span>
            <span className={cn(kidLast, "text-muted", stretchOnPhone)}>יצא/ה ב־{c.pickup}</span>
            <span />
            <span>
              <Badge tone="cool">נאסף/ה</Badge>
            </span>
          </div>
        ))}
        {absent.map((c) => (
          <div key={c.id} role="listitem" className={cn(kidRow, "bg-[#f3ebdf]")}>
            <span />
            <span className="flex items-center gap-2.5">
              <Avatar name={c.name} color={c.color} size={36} dim />
              <b className={cn(kidName, "text-muted")}>{c.name}</b>
            </span>
            <span className={cn(kidLast, "text-muted", stretchOnPhone)}>{c.absenceNote}</span>
            <span />
            <span>
              <Badge tone="mute">נעדר/ת</Badge>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
