import { Badge, Card, MessageHeader, miniButton, plainList, rowEnds } from "@/components/dashboard/ui";
import type { Inquiry } from "@/lib/domain/types";
import { cn } from "@/lib/ui/cn";

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
      <ul className={cn(plainList, "gap-1")}>
        {inquiries.map((q) => (
          <li
            key={q.id}
            className={cn("mb-2 grid gap-2 rounded-[18px] p-3.5", q.done ? "bg-[#f1eadf]" : "bg-[#faf5ec]")}
          >
            <MessageHeader title={q.from} time={q.time} />
            {q.kind === "absence" && <Badge tone="cool">דיווח היעדרות</Badge>}
            <p className={q.done ? "text-muted" : "text-[#4f3f35]"}>{q.text}</p>
            <div className={rowEnds}>
              {q.done ? <Badge tone="ok">טופל</Badge> : <Badge tone="warn">ממתין</Badge>}
              <button type="button" className={miniButton} onClick={() => onToggle(q.id, !q.done)}>
                {q.done ? "החזרה לפתוח" : "סימון כטופל"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
