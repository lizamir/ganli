import { CONTACT } from "@/content";
import { cn } from "@/lib/ui/cn";
import { formButton, formNote, formTitle } from "@/components/site/form";
import { downloadIcs, googleCalendarLink, waLink } from "@/lib/automations/calendar";
import { hebDate } from "@/lib/automations/schedule";
import type { Booking } from "@/lib/automations/types";

/** After booking: add to a calendar and confirm on WhatsApp. */
export default function BookingDone({ done, onAnother }: { done: Booking; onAnother: () => void }) {
  return (
    <div className="grid justify-items-start gap-[14px]">
      <h3 className={cn(formTitle, "text-teal-deep")}>הפגישה נקבעה ✓</h3>
      <p>
        {hebDate(done.date)} ב‑{done.time} · {done.topic}
      </p>
      <div className="flex flex-wrap gap-2.5">
        <button type="button" className={cn("btn btn-primary btn-sm", formButton)} onClick={() => downloadIcs(done)}>
          הוספה ליומן (קובץ)
        </button>
        <a
          className={cn("btn btn-ghost btn-sm", formButton)}
          href={googleCalendarLink(done)}
          target="_blank"
          rel="noreferrer"
        >
          ליומן גוגל
        </a>
        <a
          className={cn("btn btn-wa btn-sm", formButton)}
          href={waLink(
            `היי, קבעתי פגישה עם המנהלת: ${hebDate(done.date)} ב‑${done.time} (${done.topic}). ${done.name}`,
            CONTACT.whatsapp,
          )}
          target="_blank"
          rel="noreferrer"
        >
          אישור בוואטסאפ
        </a>
      </div>
      <button
        type="button"
        className="min-h-[44px] px-0 py-2 text-teal-deep underline [background:none] [border:0] [font:600_0.95rem_var(--font-display)]"
        onClick={onAnother}
      >
        לקבוע פגישה נוספת
      </button>
      <p className={cn(formNote, "text-start")}>
        בדמו הפגישה נשמרת בדפדפן הזה ומופיעה למנהלת באזור האישי, תחת &quot;אוטומציות&quot;.
      </p>
    </div>
  );
}
