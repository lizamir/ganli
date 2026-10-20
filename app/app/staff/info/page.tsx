"use client";

import { Avatar, Badge, Card, PageHead } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";

export default function StaffInfo() {
  const { data } = useGanli();
  if (!data) return null;
  const withNotes = data.children.filter((c) => c.allergy || c.careNotes || c.flag);

  return (
    <>
      <PageHead kicker="מידע לטיפול" title="מה חשוב לדעת היום" />
      <div className="info-grid">
        {withNotes.map((c) => (
          <Card key={c.id}>
            <div className="info-card">
              <Avatar name={c.name} color={c.color} size={48} />
              <div>
                <b>{c.name}</b>
                {c.allergy && <Badge tone="bad">אלרגיה: {c.allergy}</Badge>}
                {c.flag && c.flag.tone !== "bad" && <Badge tone={c.flag.tone}>{c.flag.text}</Badge>}
                {c.careNotes && <p>{c.careNotes}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <p className="hint-line">לצוות אין גישה למידע כספי. ההרשאות נאכפות בשרת (RLS), ולא רק בהסתרת מסכים.</p>
    </>
  );
}
