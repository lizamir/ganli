import Icon from "@/components/dashboard/ui/Icon";
import type { Child, GanliSnapshot } from "@/lib/domain/types";
import { cn } from "@/lib/ui/cn";
import { TONE_CLASS } from "@/lib/ui/tones";

const alertBox = "flex items-center gap-3 rounded-[18px] px-[18px] py-3.5 text-[1rem]";

/** Allergy and pickup alerts, and whether every child in the group got an update. */
export default function GroupAlerts({ alerts, stale }: { alerts: GanliSnapshot["alerts"]; stale: Child[] }) {
  return (
    <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3">
      {alerts.map((a) => (
        <div key={a.id} className={cn(alertBox, TONE_CLASS[a.tone])} role="alert">
          <Icon name={a.tone === "bad" ? "warn" : "swap"} />
          <span>
            <b className="font-heading font-semibold">{a.lead}</b> {a.text}
          </span>
        </div>
      ))}
      {stale.length === 0 ? (
        <div className={cn(alertBox, TONE_CLASS.ok)}>
          <Icon name="check" />
          <span>
            <b className="font-heading font-semibold">כל הקבוצה מעודכנת.</b> ההורים רואים את היום של הילדים.
          </span>
        </div>
      ) : (
        <div className={cn(alertBox, TONE_CLASS.warn)}>
          <Icon name="bell" />
          <span>
            <b className="font-heading font-semibold">אין עדכון שעתיים ומעלה:</b> {stale.map((c) => c.name).join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}
