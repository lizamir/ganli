"use client";

import MenuView from "@/components/dashboard/care/MenuView";
import { PageHead } from "@/components/dashboard/ui";
import { useGanli } from "@/lib/data/GanliProvider";

/** The weekly menu, with the children to watch per dish. */
export default function StaffMenu() {
  const { data } = useGanli();
  if (!data) return null;
  return (
    <>
      <PageHead kicker="תפריט שבועי" title="מה מגישים ולמי לשים לב" />
      <MenuView kids={data.children} />
      <p className="hint-line">מתחת לכל מנה מופיעים הילדים שיש להם אלרגיה לאחד המרכיבים שלה.</p>
    </>
  );
}
