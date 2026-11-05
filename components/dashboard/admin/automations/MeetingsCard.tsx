import Link from "next/link";
import { Card, Empty } from "@/components/dashboard/ui";
import { downloadIcs, googleCalendarLink, waLink, waPhone } from "@/lib/automations/calendar";
import { hebDate } from "@/lib/automations/schedule";
import { auto } from "@/lib/automations/store";
import type { Booking } from "@/lib/automations/types";

/** Meetings parents booked on the site, with calendar and WhatsApp reminders. */
export default function MeetingsCard({ upcoming }: { upcoming: Booking[] }) {
  return (
    <Card title="פגישות שנקבעו" note="מהאתר, עם זימון ליומן">
      {upcoming.length === 0 ? (
        <Empty>
          עוד אין פגישות. הורים קובעים פגישה דרך <Link href="/#meet">&quot;פגישה עם המנהלת&quot; באתר</Link>, והיא
          מופיעה כאן.
        </Empty>
      ) : (
        <ul className="inquiries">
          {upcoming.map((b) => (
            <li key={b.id}>
              <div className="msg-top">
                <b>{b.name}</b>
                <time>
                  {hebDate(b.date)} · {b.time}
                </time>
              </div>
              <p>{b.topic}</p>
              <div className="row-actions">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => downloadIcs(b)}>
                  זימון (.ics)
                </button>
                <a className="btn btn-ghost btn-sm" href={googleCalendarLink(b)} target="_blank" rel="noreferrer">
                  יומן גוגל
                </a>
                <a
                  className="btn btn-wa btn-sm"
                  href={waLink(
                    `היי ${b.name}, תזכורת לפגישה בגנלי ${hebDate(b.date)} ב‑${b.time}. נתראה!`,
                    waPhone(b.phone),
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  תזכורת בוואטסאפ
                </a>
                <button type="button" className="link-btn" onClick={() => auto.cancel(b.id)}>
                  ביטול
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
