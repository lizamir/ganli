import { Badge, Card } from "@/components/dashboard/ui";
import type { Inquiry } from "@/lib/domain/types";

/** Messages and absence reports from parents, each with a handled switch. */
export default function InquiriesCard({
  inquiries,
  onToggle,
}: {
  inquiries: Inquiry[];
  onToggle: (id: string, done: boolean) => void;
}) {
  return (
    <Card title="פניות מהורים" note={`${inquiries.filter((q) => !q.done).length} פתוחות`}>
      <ul className="inquiries">
        {inquiries.map((q) => (
          <li key={q.id} className={q.done ? "done" : undefined}>
            <div className="msg-top">
              <b>{q.from}</b>
              <time>{q.time}</time>
            </div>
            {q.kind === "absence" && <Badge tone="cool">דיווח היעדרות</Badge>}
            <p>{q.text}</p>
            <div className="row-end">
              {q.done ? <Badge tone="ok">טופל</Badge> : <Badge tone="warn">ממתין</Badge>}
              <button type="button" className="mini-btn" onClick={() => onToggle(q.id, !q.done)}>
                {q.done ? "החזרה לפתוח" : "סימון כטופל"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
