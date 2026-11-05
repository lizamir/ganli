import { Avatar, Badge, Card } from "@/components/dashboard/ui";
import { lastUpdate, minutesSince, STALE_MINUTES } from "@/lib/domain/care";
import type { GanliSnapshot } from "@/lib/domain/types";

/** Which children got an update lately: g recent, y overdue, x absent. */
export default function CoverageCard({ data }: { data: GanliSnapshot }) {
  const coverage = (id: string) => {
    const last = lastUpdate(data.events, id);
    return last && minutesSince(data.now, last) < STALE_MINUTES ? "g" : "y";
  };
  return (
    <Card title="עדכונים אחרונים" note="לפי ילד">
      <div className="coverage">
        {data.children.map((c) => {
          const st = c.status === "absent" ? "x" : coverage(c.id);
          return (
            <div key={c.id} className={`cov cov-${st}`}>
              <Avatar name={c.name} color={st === "g" ? "#9fd8cf" : st === "y" ? "#f6c86e" : "#e7ded2"} size={44} />
              <span>{c.name}</span>
            </div>
          );
        })}
      </div>
      <div className="legend">
        <Badge tone="ok">עודכן בשעתיים האחרונות</Badge>
        <Badge tone="warn">יותר משעתיים</Badge>
        <Badge tone="mute">נעדר</Badge>
      </div>
    </Card>
  );
}
