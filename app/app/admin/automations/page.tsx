"use client";

import ActionLog from "@/components/dashboard/admin/automations/ActionLog";
import AutomationList from "@/components/dashboard/admin/automations/AutomationList";
import MeetingsCard from "@/components/dashboard/admin/automations/MeetingsCard";
import SignupsCard from "@/components/dashboard/admin/automations/SignupsCard";
import { Badge, PageHead, hintLine } from "@/components/dashboard/ui";
import { useAutomations } from "@/lib/automations/store";
import { useGanli } from "@/lib/data/GanliProvider";

/** The director's automation hub: what runs by itself, meetings that were booked, sign-up lists with reminders, and a log. */
export default function AdminAutomations() {
  const { data } = useGanli();
  const a = useAutomations();
  if (!data) return null;

  const upcoming = [...a.bookings].sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time));

  return (
    <>
      <PageHead
        kicker="אוטומציות"
        title="מה קורה לבד בגן"
        actions={<Badge tone="ok">{Object.values(a.on).filter(Boolean).length} פעילות</Badge>}
      />

      <div className="grid grid-cols-[repeat(2,1fr)] gap-5 mobile:grid-cols-[1fr]">
        <AutomationList on={a.on} />
        <MeetingsCard upcoming={upcoming} />
        <SignupsCard signups={a.signups} kids={data.children} />
        <ActionLog log={a.log} />
      </div>
      <p className={hintLine}>
        מה עובד כאן באמת: זימונים ליומן, קישורים ליומן גוגל, והודעות וואטסאפ שנפתחות מוכנות לשליחה. שליחה אוטומטית
        לגמרי, בלי לחיצה, דורשת חיבור ל‑WhatsApp Business API (למשל דרך n8n), וזה השלב הבא.
      </p>
    </>
  );
}
