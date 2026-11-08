import { Badge, Card, MessageHeader, plainList } from "@/components/dashboard/ui";
import type { Inquiry } from "@/lib/domain/types";
import { cn } from "@/lib/ui/cn";

/** The parent's own latest messages and their status. */
export default function MyInquiries({ mine }: { mine: Inquiry[] }) {
  return (
    <Card title="הפניות שלי">
      <ul className={cn(plainList, "gap-1")}>
        {mine.slice(0, 5).map((q) => (
          <li
            key={q.id}
            className={cn("mb-2 grid gap-2 rounded-[18px] p-3.5", q.done ? "bg-[#f1eadf]" : "bg-[#faf5ec]")}
          >
            <MessageHeader title={q.kind === "absence" ? "דיווח היעדרות" : "הודעה"} time={q.time} />
            <p className={q.done ? "text-muted" : "text-[#4f3f35]"}>{q.text}</p>
            {q.done ? <Badge tone="ok">טופל</Badge> : <Badge tone="warn">ממתין</Badge>}
          </li>
        ))}
      </ul>
    </Card>
  );
}
