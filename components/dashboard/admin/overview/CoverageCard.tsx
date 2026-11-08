import { Avatar, Badge, Card } from "@/components/dashboard/ui";
import { lastUpdate, minutesSince, STALE_MINUTES } from "@/lib/domain/care";
import type { GanliSnapshot } from "@/lib/domain/types";
import { cn } from "@/lib/ui/cn";

/** Which children got an update lately: g recent, y overdue, x absent. */
export default function CoverageCard({ data }: { data: GanliSnapshot }) {
  const coverage = (id: string) => {
    const last = lastUpdate(data.events, id);
    return last && minutesSince(data.now, last) < STALE_MINUTES ? "g" : "y";
  };
  return (
    <Card title="עדכונים אחרונים" note="לפי ילד">
      <div className="grid grid-cols-[repeat(5,1fr)] gap-x-1.5 gap-y-3.5 mobile:grid-cols-[repeat(2,1fr)]">
        {data.children.map((c) => {
          const st = c.status === "absent" ? "x" : coverage(c.id);
          return (
            <div
              key={c.id}
              className="grid justify-items-center gap-1.5 font-heading text-[0.875rem]/[normal] font-medium"
            >
              <Avatar
                name={c.name}
                color={st === "g" ? "#9fd8cf" : st === "y" ? "#f6c86e" : "#e7ded2"}
                size={44}
                className={cn(st === "x" && "text-muted")}
              />
              <span className={cn(st === "x" && "text-muted")}>{c.name}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-[18px] flex flex-wrap gap-2">
        <Badge tone="ok">עודכן בשעתיים האחרונות</Badge>
        <Badge tone="warn">יותר משעתיים</Badge>
        <Badge tone="mute">נעדר</Badge>
      </div>
    </Card>
  );
}
