import { Card, plainList } from "@/components/dashboard/ui";
import { AUTOMATIONS } from "@/lib/automations/catalog";
import { auto } from "@/lib/automations/store";
import { cn } from "@/lib/ui/cn";

const autoText = "text-[0.9375rem] text-subtle";

/** Each automation with its on/off switch. */
export default function AutomationList({ on }: { on: Record<string, boolean> }) {
  return (
    <Card title="אוטומציות" note="מה מפעיל ומה קורה">
      <ul className={plainList}>
        {AUTOMATIONS.map((x) => (
          <li
            key={x.id}
            className="flex items-center gap-4 py-3.5 [border-bottom:1px_dashed_var(--sand)] last:[border-bottom:0]"
          >
            <div className="grid flex-1 gap-0.5">
              <b className="font-heading text-[1.05rem]/[normal] font-semibold">{x.trigger}</b>
              <span className={autoText}>{x.action}</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={!!on[x.id]} onChange={() => auto.toggle(x.id)} />
              <span className={autoText} aria-hidden="true" />
              <span className={cn("sr-only", autoText)}>{x.trigger}</span>
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}
