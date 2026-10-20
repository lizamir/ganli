"use client";

import MenuView from "@/components/app/MenuView";
import { PageHead } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";

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
