import { Card, Empty } from "@/components/dashboard/ui";
import type { LogItem } from "@/lib/automations/types";

/** What happened lately. */
export default function ActionLog({ log }: { log: LogItem[] }) {
  return (
    <Card title="יומן פעולות" note="מה קרה לאחרונה" className="span-2">
      {log.length === 0 ? (
        <Empty>עוד לא קרה כלום. קבעו פגישה באתר או השאירו פנייה, ותראו את זה כאן.</Empty>
      ) : (
        <ol className="auto-log">
          {log.map((l) => (
            <li key={l.id}>
              <time>{l.at}</time>
              <span>{l.text}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
