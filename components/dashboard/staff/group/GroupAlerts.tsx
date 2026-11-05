import Icon from "@/components/dashboard/ui/Icon";
import type { Child, GanliSnapshot } from "@/lib/domain/types";

/** Allergy and pickup alerts, and whether every child in the group got an update. */
export default function GroupAlerts({ alerts, stale }: { alerts: GanliSnapshot["alerts"]; stale: Child[] }) {
  return (
    <div className="alerts">
      {alerts.map((a) => (
        <div key={a.id} className={`alert tone-${a.tone}`} role="alert">
          <Icon name={a.tone === "bad" ? "warn" : "swap"} />
          <span>
            <b>{a.lead}</b> {a.text}
          </span>
        </div>
      ))}
      {stale.length === 0 ? (
        <div className="alert tone-ok">
          <Icon name="check" />
          <span>
            <b>כל הקבוצה מעודכנת.</b> ההורים רואים את היום של הילדים.
          </span>
        </div>
      ) : (
        <div className="alert tone-warn">
          <Icon name="bell" />
          <span>
            <b>אין עדכון שעתיים ומעלה:</b> {stale.map((c) => c.name).join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}
