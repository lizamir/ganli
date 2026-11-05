import DayRibbon from "@/components/dashboard/care/DayRibbon";
import { Avatar, Badge, Card } from "@/components/dashboard/ui";
import { lastUpdate, STALE_MINUTES } from "@/lib/domain/care";
import type { Child, GanliSnapshot } from "@/lib/domain/types";

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
      <div className="kids-table" role="list">
        <div className="kids-head" aria-hidden="true">
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
            <div key={c.id} role="listitem" className={`kid-row${isPicked ? " picked" : ""}`}>
              <input
                type="checkbox"
                checked={isPicked}
                onChange={() => onToggle(c.id)}
                aria-label={`בחירת ${c.name}`}
              />
              <span className="kid-name">
                <Avatar name={c.name} color={c.color} size={36} />
                <b>{c.name}</b>
              </span>
              <DayRibbon compact arrival={c.arrival} now={data.now} events={events} />
              <span className="kid-last">{lastUpdate(data.events, c.id) ?? `הגעה ${c.arrival}`}</span>
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
          <div key={c.id} role="listitem" className="kid-row absent">
            <span />
            <span className="kid-name">
              <Avatar name={c.name} color={c.color} size={36} dim />
              <b>{c.name}</b>
            </span>
            <span className="kid-last">יצא/ה ב־{c.pickup}</span>
            <span />
            <span>
              <Badge tone="cool">נאסף/ה</Badge>
            </span>
          </div>
        ))}
        {absent.map((c) => (
          <div key={c.id} role="listitem" className="kid-row absent">
            <span />
            <span className="kid-name">
              <Avatar name={c.name} color={c.color} size={36} dim />
              <b>{c.name}</b>
            </span>
            <span className="kid-last">{c.absenceNote}</span>
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
