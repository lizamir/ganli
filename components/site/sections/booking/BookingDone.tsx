import { CONTACT } from "@/content";
import { downloadIcs, googleCalendarLink, waLink } from "@/lib/automations/calendar";
import { hebDate } from "@/lib/automations/schedule";
import type { Booking } from "@/lib/automations/types";

/** After booking: add to a calendar and confirm on WhatsApp. */
export default function BookingDone({ done, onAnother }: { done: Booking; onAnother: () => void }) {
  return (
    <div className="meet-done">
      <h3>הפגישה נקבעה ✓</h3>
      <p>
        {hebDate(done.date)} ב‑{done.time} · {done.topic}
      </p>
      <div className="meet-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => downloadIcs(done)}>
          הוספה ליומן (קובץ)
        </button>
        <a className="btn btn-ghost btn-sm" href={googleCalendarLink(done)} target="_blank" rel="noreferrer">
          ליומן גוגל
        </a>
        <a
          className="btn btn-wa btn-sm"
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
      <button type="button" className="link-btn" onClick={onAnother}>
        לקבוע פגישה נוספת
      </button>
      <p className="form-note">בדמו הפגישה נשמרת בדפדפן הזה ומופיעה למנהלת באזור האישי, תחת &quot;אוטומציות&quot;.</p>
    </div>
  );
}
