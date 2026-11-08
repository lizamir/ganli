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
import type { Rsvp, UpcomingEvent } from "@/lib/domain/types";
import { cn } from "@/lib/ui/cn";

/** A coming / not coming button; `on` is the answer that was chosen. */
const rsvpButton = (on: string | false) =>
  cn(
    "min-h-10 rounded-[999px] border-2 border-solid border-cocoa-deep bg-paper px-3.5 py-2 text-[0.9rem] font-bold",
    on,
  );

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
      <ul className={eventList}>
        {upcoming.map((u) => (
          <li key={u.id} className={eventRow}>
            <DateChip month={u.month} day={u.day} className={inSmallText} />
            <div className="grid flex-1">
              <b className={eventTitle}>{u.title}</b>
              <span className={eventDetail}>{u.sub}</span>
              {u.rsvp && (
                <div
                  className="mt-2 flex flex-wrap items-center gap-2"
                  role="group"
                  aria-label={`אישור הגעה: ${u.title}`}
                >
                  <button
                    type="button"
                    aria-pressed={u.rsvp.mine === "yes"}
                    className={rsvpButton(u.rsvp.mine === "yes" && "border-teal-deep bg-teal-deep text-white")}
                    onClick={() => onRsvp(u.id, "yes")}
                  >
                    מגיעים ✓
                  </button>
                  <button
                    type="button"
                    aria-pressed={u.rsvp.mine === "no"}
                    className={rsvpButton(u.rsvp.mine === "no" && "bg-cocoa-deep text-white")}
                    onClick={() => onRsvp(u.id, "no")}
                  >
                    לא מגיעים
                  </button>
                  <small className="text-muted">{u.rsvp.going} משפחות מגיעות</small>
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
