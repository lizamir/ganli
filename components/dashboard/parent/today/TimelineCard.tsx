import { Card, Disc } from "@/components/dashboard/ui";
import { KIND } from "@/components/dashboard/care/careKinds";
import type { CareEvent, Child } from "@/lib/domain/types";

/** Everything logged today, newest first, ending with the arrival. */
export default function TimelineCard({ child, events }: { child: Child; events: CareEvent[] }) {
  return (
    <Card title="מה קרה היום">
      <ul className="timeline-list">
        {[...events].reverse().map((e) => (
          <li key={e.id}>
            <Disc icon={KIND[e.kind].icon} color={KIND[e.kind].color} size={34} />
            <div>
              <b>{e.title}</b>
              <span>{e.detail}</span>
            </div>
            <time>{e.end ?? e.start}</time>
          </li>
        ))}
        <li>
          <Disc icon="foot" color={KIND.arrival.color} size={34} />
          <div>
            <b>הגיעה</b>
            <span>נכנסה בחיוך</span>
          </div>
          <time>{child.arrival}</time>
        </li>
        <li className="dim">
          <Disc icon="calendar" color="#cfc3b3" size={34} />
          <div>
            <b>ארוחת ארבע ופעילות</b>
            <span>טרם עודכן</span>
          </div>
          <time>בהמשך</time>
        </li>
      </ul>
    </Card>
  );
}
