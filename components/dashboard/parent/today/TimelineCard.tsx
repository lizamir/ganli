import {
  Card,
  Disc,
  inSmallText,
  plainList,
  timelineDetail,
  timelineItem,
  timelineTime,
  timelineTitle,
} from "@/components/dashboard/ui";
import { cn } from "@/lib/ui/cn";
import { KIND } from "@/components/dashboard/care/careKinds";
import type { CareEvent, Child } from "@/lib/domain/types";

/** Everything logged today, newest first, ending with the arrival. */
export default function TimelineCard({ child, events }: { child: Child; events: CareEvent[] }) {
  return (
    <Card title="מה קרה היום">
      <ul className={plainList}>
        {[...events].reverse().map((e) => (
          <li key={e.id} className={timelineItem}>
            <Disc icon={KIND[e.kind].icon} color={KIND[e.kind].color} size={34} className={inSmallText} />
            <div className="grid flex-1">
              <b className={timelineTitle}>{e.title}</b>
              <span className={timelineDetail}>{e.detail}</span>
            </div>
            <time className={timelineTime}>{e.end ?? e.start}</time>
          </li>
        ))}
        <li className={timelineItem}>
          <Disc icon="foot" color={KIND.arrival.color} size={34} className={inSmallText} />
          <div className="grid flex-1">
            <b className={timelineTitle}>הגיעה</b>
            <span className={timelineDetail}>נכנסה בחיוך</span>
          </div>
          <time className={timelineTime}>{child.arrival}</time>
        </li>
        <li className={timelineItem}>
          <Disc icon="calendar" color="#cfc3b3" size={34} className={inSmallText} />
          <div className="grid flex-1">
            <b className={cn(timelineTitle, "text-muted")}>ארוחת ארבע ופעילות</b>
            <span className={timelineDetail}>טרם עודכן</span>
          </div>
          <time className={timelineTime}>בהמשך</time>
        </li>
      </ul>
    </Card>
  );
}
