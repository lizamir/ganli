import { Card, Empty } from "@/components/dashboard/ui";
import type { LogItem } from "@/lib/automations/types";

/** What happened lately. */
export default function ActionLog({ log }: { log: LogItem[] }) {
  return (
    <Card title="יומן פעולות" note="מה קרה לאחרונה" className="[grid-column:1/-1]">
      {log.length === 0 ? (
        <Empty>עוד לא קרה כלום. קבעו פגישה באתר או השאירו פנייה, ותראו את זה כאן.</Empty>
      ) : (
        <ol className="m-0 grid max-h-[280px] list-none gap-0.5 overflow-auto p-0">
          {log.map((l) => (
            <li
              key={l.id}
              className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[0.95rem] [border-bottom:1px_solid_#f0e6d8]"
            >
              <time className="text-start text-subtle [direction:ltr]">{l.at}</time>
              <span>{l.text}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
