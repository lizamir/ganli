"use client";

import { useState } from "react";
import Scene from "@/components/dashboard/care/Scene";
import { Badge, Empty, PageHead, hintLine } from "@/components/dashboard/ui";
import { useGanli } from "@/lib/data/GanliProvider";
import { cn } from "@/lib/ui/cn";

const segButton =
  "rounded-[999px] px-[18px] py-2.5 font-heading text-[0.9375rem]/[normal] font-semibold text-cocoa [background:none] [border:0] aria-selected:[background:var(--paper)] aria-selected:shadow-[0_2px_6px_rgba(62,50,43,0.12)]";

/** The child's photo album. */
export default function ParentPhotos() {
  const { data, profile } = useGanli();
  const [tab, setTab] = useState<"group" | "mine">("mine");
  // Per the spec, the child's private album holds only photos a parent chose to keep.
  const [kept, setKept] = useState<string[]>(["p1"]);
  if (!data || !profile) return null;
  const child = data.children.find((c) => c.id === profile.childId) ?? data.children[0];
  const photos = tab === "mine" ? data.photos.filter((p) => kept.includes(p.id)) : data.photos;

  return (
    <>
      <PageHead
        kicker="אלבומים"
        title={tab === "mine" ? `האלבום של ${child.name}` : "האלבום הקבוצתי"}
        actions={
          <div className="inline-flex rounded-[999px] bg-sand p-1" role="tablist">
            <button role="tab" aria-selected={tab === "mine"} onClick={() => setTab("mine")} className={segButton}>
              האלבום של {child.name}
            </button>
            <button role="tab" aria-selected={tab === "group"} onClick={() => setTab("group")} className={segButton}>
              אלבום קבוצתי
            </button>
          </div>
        }
      />
      {photos.length === 0 ? (
        <Empty>עוד לא שמרתם תמונות לאלבום. אפשר לבחור תמונות מהאלבום הקבוצתי.</Empty>
      ) : (
        <div className="grid grid-cols-[repeat(3,1fr)] gap-5 narrow:grid-cols-[repeat(2,1fr)]">
          {photos.map((p) => {
            const tagged = p.tags.includes(child.name);
            const isKept = kept.includes(p.id);
            return (
              <figure
                key={p.id}
                className="relative m-0 overflow-hidden rounded-[24px] bg-paper shadow-[0_14px_30px_-22px_rgba(62,50,43,0.4)]"
              >
                <Scene name={p.scene} label={p.caption} className="block aspect-[4/3] w-full" />
                <figcaption className="flex items-center justify-between gap-2.5 px-4 py-3.5">
                  <div>
                    <b className="block font-heading text-[1.0625rem]/[normal] font-semibold">{p.caption}</b>
                    <span className="text-[0.8125rem] text-subtle">היום · {p.time}</span>
                  </div>
                  {tagged && <Badge tone="pink">{child.name} בתמונה</Badge>}
                </figcaption>
                {tab === "group" && tagged && (
                  <button
                    type="button"
                    className={cn(
                      "absolute end-3 top-3 rounded-[999px] px-3.5 py-2 font-heading text-[0.875rem]/[normal] font-semibold shadow-block [border:0]",
                      isKept ? "bg-teal text-white" : "bg-paper text-cocoa-deep",
                    )}
                    aria-pressed={isKept}
                    onClick={() => setKept((k) => (isKept ? k.filter((x) => x !== p.id) : [...k, p.id]))}
                  >
                    {isKept ? "נשמרה באלבום ✓" : "+ לאלבום של " + child.name}
                  </button>
                )}
              </figure>
            );
          })}
        </div>
      )}
      <p className={hintLine}>תמונה נוספת לאלבום הפרטי רק כשההורה בוחר בה. הסרה מהאלבום לא מוחקת את התמונה הקבוצתית.</p>
    </>
  );
}
