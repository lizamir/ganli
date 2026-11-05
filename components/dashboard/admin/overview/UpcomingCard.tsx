import Link from "next/link";
import Icon from "@/components/dashboard/ui/Icon";
import { Badge, Card } from "@/components/dashboard/ui";
import type { UpcomingEvent } from "@/lib/domain/types";

/** Events coming up, with how many families answered. */
export default function UpcomingCard({ upcoming }: { upcoming: UpcomingEvent[] }) {
  return (
    <Card title="בקרוב">
      <ul className="upcoming">
        {upcoming.map((u) => (
          <li key={u.id}>
            <span className="date-chip">
              <small>{u.month}</small>
              <b>{u.day}</b>
            </span>
            <div>
              <b>{u.title}</b>
              <span>
                {u.sub}
                {u.rsvp ? ` · ${u.rsvp.going} מגיעים, ${u.rsvp.of - u.rsvp.going - u.rsvp.notGoing} טרם ענו` : ""}
              </span>
            </div>
            <Badge tone={u.tone}>{u.tag}</Badge>
          </li>
        ))}
      </ul>
      <Link href="/app/admin/messages/" className="add-link">
        <Icon name="plus" size={16} /> הודעה חדשה להורים
      </Link>
    </Card>
  );
}
