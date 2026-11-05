import { Badge, Card } from "@/components/dashboard/ui";
import type { Rsvp, UpcomingEvent } from "@/lib/domain/types";

/** Upcoming events; those that ask for it have coming / not coming buttons. */
export default function UpcomingRsvp({
  upcoming,
  onRsvp,
}: {
  upcoming: UpcomingEvent[];
  onRsvp: (id: string, answer: Rsvp) => void;
}) {
  return (
    <Card title="בקרוב בגן">
      <ul className="upcoming">
        {upcoming.map((u) => (
          <li key={u.id} className="up-row">
            <span className="date-chip">
              <small>{u.month}</small>
              <b>{u.day}</b>
            </span>
            <div>
              <b>{u.title}</b>
              <span>{u.sub}</span>
              {u.rsvp && (
                <div className="rsvp" role="group" aria-label={`אישור הגעה: ${u.title}`}>
                  <button
                    type="button"
                    aria-pressed={u.rsvp.mine === "yes"}
                    className={u.rsvp.mine === "yes" ? "on yes" : undefined}
                    onClick={() => onRsvp(u.id, "yes")}
                  >
                    מגיעים ✓
                  </button>
                  <button
                    type="button"
                    aria-pressed={u.rsvp.mine === "no"}
                    className={u.rsvp.mine === "no" ? "on no" : undefined}
                    onClick={() => onRsvp(u.id, "no")}
                  >
                    לא מגיעים
                  </button>
                  <small>{u.rsvp.going} משפחות מגיעות</small>
                </div>
              )}
            </div>
            <Badge tone={u.tone}>{u.tag}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
