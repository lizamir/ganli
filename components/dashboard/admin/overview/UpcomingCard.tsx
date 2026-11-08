import Link from "next/link";
import Icon from "@/components/dashboard/ui/Icon";
import {
  Badge,
  Card,
  DateChip,
  eventDetail,
  eventList,
  eventRow,
  eventTitle,
  inSmallText,
} from "@/components/dashboard/ui";
import type { UpcomingEvent } from "@/lib/domain/types";

/** Events coming up, with how many families answered. */
export default function UpcomingCard({ upcoming }: { upcoming: UpcomingEvent[] }) {
  return (
    <Card title="בקרוב">
      <ul className={eventList}>
        {upcoming.map((u) => (
          <li key={u.id} className={eventRow}>
            <DateChip month={u.month} day={u.day} className={inSmallText} />
            <div className="grid flex-1">
              <b className={eventTitle}>{u.title}</b>
              <span className={eventDetail}>
                {u.sub}
                {u.rsvp ? ` · ${u.rsvp.going} מגיעים, ${u.rsvp.of - u.rsvp.going - u.rsvp.notGoing} טרם ענו` : ""}
              </span>
            </div>
            <Badge tone={u.tone}>{u.tag}</Badge>
          </li>
        ))}
      </ul>
      <Link
        href="/app/admin/messages/"
        className="mt-3 inline-flex items-center gap-1.5 font-heading text-[0.9375rem]/[normal] font-semibold text-teal-deep"
      >
        <Icon name="plus" size={16} /> הודעה חדשה להורים
      </Link>
    </Card>
  );
}
