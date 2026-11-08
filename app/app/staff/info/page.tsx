"use client";

import { Avatar, Badge, Card, PageHead, hintLine } from "@/components/dashboard/ui";
import { useGanli } from "@/lib/data/GanliProvider";

/** Allergies and care notes the staff must know. */
export default function StaffInfo() {
  const { data } = useGanli();
  if (!data) return null;
  const withNotes = data.children.filter((c) => c.allergy || c.careNotes || c.flag);

  return (
    <>
      <PageHead kicker="מידע לטיפול" title="מה חשוב לדעת היום" />
      <div className="grid grid-cols-[repeat(3,1fr)] gap-5 narrow:grid-cols-[repeat(2,1fr)] mobile:grid-cols-[repeat(2,1fr)]">
        {withNotes.map((c) => (
          <Card key={c.id}>
            <div className="flex [align-items:start] gap-3.5">
              <Avatar name={c.name} color={c.color} size={48} />
              <div className="grid justify-items-start gap-1.5">
                <b className="font-heading text-[1.25rem]/[normal] font-semibold">{c.name}</b>
                {c.allergy && <Badge tone="bad">אלרגיה: {c.allergy}</Badge>}
                {c.flag && c.flag.tone !== "bad" && <Badge tone={c.flag.tone}>{c.flag.text}</Badge>}
                {c.careNotes && <p className="text-[0.9375rem] text-[#6f5d52]">{c.careNotes}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <p className={hintLine}>לצוות אין גישה למידע כספי. ההרשאות נאכפות בשרת (RLS), ולא רק בהסתרת מסכים.</p>
    </>
  );
}
