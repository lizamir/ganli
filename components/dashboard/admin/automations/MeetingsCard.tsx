import Link from "next/link";
import { Card, Empty, LinkButton, MessageHeader, plainList } from "@/components/dashboard/ui";
import { downloadIcs, googleCalendarLink, waLink, waPhone } from "@/lib/automations/calendar";
import { hebDate } from "@/lib/automations/schedule";
import { auto } from "@/lib/automations/store";
import type { Booking } from "@/lib/automations/types";
import { cn } from "@/lib/ui/cn";

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
        <ul className={cn(plainList, "gap-1")}>
          {upcoming.map((b) => (
            <li key={b.id} className="mb-2 grid gap-2 rounded-[18px] bg-[#faf5ec] p-3.5">
              <MessageHeader
                title={b.name}
                time={
                  <>
                    {hebDate(b.date)} · {b.time}
                  </>
                }
              />
              <p className="text-[#4f3f35]">{b.topic}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
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
                <LinkButton onClick={() => auto.cancel(b.id)}>ביטול</LinkButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
