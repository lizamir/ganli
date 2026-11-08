"use client";

import { Badge, Card, Empty, MessageHeader, PageHead, hintLine, plainList } from "@/components/dashboard/ui";
import { useGanli } from "@/lib/data/GanliProvider";
import { cn } from "@/lib/ui/cn";

/** Enrollment requests that came from the site. */
export default function AdminLeads() {
  const { data, mode } = useGanli();
  if (!data) return null;
  return (
    <>
      <PageHead
        kicker="הרשמות"
        title="בקשות הרשמה וסיור"
        actions={<Badge tone={data.leads.length ? "warn" : "mute"}>{data.leads.length} בקשות</Badge>}
      />
      <Card title="מהאתר">
        {data.leads.length === 0 ? (
          <Empty>
            עוד לא הגיעו בקשות. כל מי שממלא את הטופס &quot;תיאום סיור והרשמה&quot; באתר מופיע כאן.
            {mode === "demo" && " בדמו אפשר למלא את הטופס באתר ולחזור לכאן."}
          </Empty>
        ) : (
          <ul className={cn(plainList, "gap-1")}>
            {data.leads.map((l) => (
              <li key={l.id} className="mb-2 grid gap-2 rounded-[18px] bg-[#faf5ec] p-3.5">
                <MessageHeader title={l.parent} time={l.time} />
                <p className="text-[#4f3f35]">
                  <a href={`tel:${l.phone}`} dir="ltr">
                    {l.phone}
                  </a>
                  {l.child && <> · {l.child}</>}
                  {l.group && <> · {l.group}</>}
                </p>
                {l.message && <p className="text-[#4f3f35]">{l.message}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <p className={hintLine}>בקשות הרשמה נשמרות בטבלת leads עם הרשאות: האתר רשאי להוסיף, ורק המנהלת רשאית לקרוא.</p>
    </>
  );
}
