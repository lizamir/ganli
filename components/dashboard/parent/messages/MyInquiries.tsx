import { Badge, Card } from "@/components/dashboard/ui";
import type { Inquiry } from "@/lib/domain/types";

/** The parent's own latest messages and their status. */
export default function MyInquiries({ mine }: { mine: Inquiry[] }) {
  return (
    <Card title="הפניות שלי">
      <ul className="inquiries">
        {mine.slice(0, 5).map((q) => (
          <li key={q.id} className={q.done ? "done" : undefined}>
            <div className="msg-top">
              <b>{q.kind === "absence" ? "דיווח היעדרות" : "הודעה"}</b>
              <time>{q.time}</time>
            </div>
            <p>{q.text}</p>
            {q.done ? <Badge tone="ok">טופל</Badge> : <Badge tone="warn">ממתין</Badge>}
          </li>
        ))}
      </ul>
    </Card>
  );
}
