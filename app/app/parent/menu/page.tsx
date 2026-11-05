"use client";

import MenuView from "@/components/dashboard/care/MenuView";
import { Badge, PageHead } from "@/components/dashboard/ui";
import { useGanli } from "@/lib/data/GanliProvider";

/** The weekly menu, marked for the child's allergies. */
export default function ParentMenu() {
  const { data, profile } = useGanli();
  if (!data || !profile) return null;
  const child = data.children.find((c) => c.id === profile.childId) ?? data.children[0];

  return (
    <>
      <PageHead
        kicker="תפריט שבועי"
        title="מה אוכלים השבוע"
        actions={
          child.allergy ? (
            <Badge tone="bad">
              אלרגיה של {child.name}: {child.allergy}
            </Badge>
          ) : (
            <Badge tone="ok">אין אלרגיות ידועות ל{child.name}</Badge>
          )
        }
      />
      <MenuView child={child} />
      <p className="hint-line">כל הארוחות מבושלות בגן. מנה שמסומנת באדום לא מתאימה לילד, והצוות מכין לו חלופה.</p>
    </>
  );
}
