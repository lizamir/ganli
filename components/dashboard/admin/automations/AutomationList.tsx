import { Card } from "@/components/dashboard/ui";
import { AUTOMATIONS } from "@/lib/automations/catalog";
import { auto } from "@/lib/automations/store";

/** Each automation with its on/off switch. */
export default function AutomationList({ on }: { on: Record<string, boolean> }) {
  return (
    <Card title="אוטומציות" note="מה מפעיל ומה קורה">
      <ul className="auto-list">
        {AUTOMATIONS.map((x) => (
          <li key={x.id}>
            <div>
              <b>{x.trigger}</b>
              <span>{x.action}</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={!!on[x.id]} onChange={() => auto.toggle(x.id)} />
              <span aria-hidden="true" />
              <span className="sr-only">{x.trigger}</span>
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}
