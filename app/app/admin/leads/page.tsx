"use client";

import { Badge, Card, Empty, PageHead } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";

export default function AdminLeads() {
  const { data, mode } = useGanli();
  if (!data) return null;
  return (
    <>
      <PageHead kicker="הרשמות" title="בקשות הרשמה וסיור" actions={<Badge tone={data.leads.length ? "warn" : "mute"}>{data.leads.length} בקשות</Badge>} />
      <Card title="מהאתר">
        {data.leads.length === 0 ? (
          <Empty>
            עוד לא הגיעו בקשות. כל מי שממלא את הטופס &quot;תיאום סיור והרשמה&quot; באתר מופיע כאן.
            {mode === "demo" && " בדמו אפשר למלא את הטופס באתר ולחזור לכאן."}
          </Empty>
        ) : (
          <ul className="inquiries">
            {data.leads.map((l) => (
              <li key={l.id}>
                <div className="msg-top">
                  <b>{l.parent}</b>
                  <time>{l.time}</time>
                </div>
                <p>
                  <a href={`tel:${l.phone}`} dir="ltr">
                    {l.phone}
                  </a>
                  {l.child && <> · {l.child}</>}
                  {l.group && <> · {l.group}</>}
                </p>
                {l.message && <p>{l.message}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <p className="hint-line">בקשות הרשמה נשמרות בטבלת leads עם הרשאות: האתר רשאי להוסיף, ורק המנהלת רשאית לקרוא.</p>
    </>
  );
}
