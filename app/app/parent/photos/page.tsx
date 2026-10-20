"use client";

import { useState } from "react";
import Scene from "@/components/app/Scene";
import { Badge, Empty, PageHead } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";

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
          <div className="seg" role="tablist">
            <button role="tab" aria-selected={tab === "mine"} onClick={() => setTab("mine")}>
              האלבום של {child.name}
            </button>
            <button role="tab" aria-selected={tab === "group"} onClick={() => setTab("group")}>
              אלבום קבוצתי
            </button>
          </div>
        }
      />
      {photos.length === 0 ? (
        <Empty>עוד לא שמרתם תמונות לאלבום. אפשר לבחור תמונות מהאלבום הקבוצתי.</Empty>
      ) : (
        <div className="gallery">
          {photos.map((p) => {
            const tagged = p.tags.includes(child.name);
            const isKept = kept.includes(p.id);
            return (
              <figure key={p.id} className="gallery-item">
                <Scene name={p.scene} label={p.caption} />
                <figcaption>
                  <div>
                    <b>{p.caption}</b>
                    <span>היום · {p.time}</span>
                  </div>
                  {tagged && <Badge tone="pink">{child.name} בתמונה</Badge>}
                </figcaption>
                {tab === "group" && tagged && (
                  <button
                    type="button"
                    className={`keep${isKept ? " on" : ""}`}
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
      <p className="hint-line">תמונה נוספת לאלבום הפרטי רק כשההורה בוחר בה. הסרה מהאלבום לא מוחקת את התמונה הקבוצתית.</p>
    </>
  );
}
