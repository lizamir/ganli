"use client";

import { cn } from "@/lib/ui/cn";
import { section } from "@/components/site/ui";
import Link from "next/link";
import { useState } from "react";
import { FEATURES } from "@/content";
import FeatureVisual from "./FeatureVisual";
import RoleMock, { type Tab } from "./RoleMock";

const roleTab =
  "grid gap-[2px] rounded-[22px] border-2 px-[22px] py-[18px] text-right [transition:background_0.25s,border-color_0.25s,transform_0.3s_var(--ease-spring)] hover:[transform:translateX(-4px)] mobile:px-[6px] mobile:py-[14px] mobile:text-center mobile:hover:[transform:none]";
const roleTabOn = "border-cocoa-deep [background:var(--paper)] shadow-block";
const roleTabOff = "border-transparent [background:rgba(255,253,248,0.55)]";
const DEVICE_DOTS = ["bg-tomato", "bg-mustard", "bg-[#6ed38b]"];

// The feature grid: a few tinted cards, wide and tall ones span two cells (one column on phones).
// No transform/transition on the cards: they are .reveal elements.
const featureCard =
  "reveal relative grid [align-content:space-between] gap-4 overflow-hidden rounded-[30px] p-6 shadow-[0_1px_0_rgba(62,50,43,0.06),0_16px_34px_-24px_rgba(62,50,43,0.5)]";
const FEATURE_TINT = ["bg-teal-soft", "bg-mustard-soft", "bg-paper", "bg-blush-soft", "bg-lilac-soft", "bg-teal-soft"];
const FEATURE_SIZE: Record<string, string> = {
  wide: "[grid-column:span_2] mobile:[grid-column:auto]",
  tall: "[grid-row:span_2] tablet:[grid-row:auto]",
  normal: "",
};

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: "parent", label: "הורה", hint: "היום של הילד, בזמן אמת" },
  { id: "staff", label: "צוות", hint: "כל הקבוצה במבט אחד" },
  { id: "admin", label: "מנהלת", hint: "המשפחתון כולו, מסודר" },
];

/** The app section of the marketing site: a preview per role and a grid of features. */
export default function AppShowcase() {
  const [tab, setTab] = useState<Tab>("parent");
  return (
    <section className={cn(section, "bg-sand")} id="app" aria-labelledby="app-title">
      <div className="container">
        <div className="reveal mb-14 flex [align-items:end] justify-between gap-10 mobile:mb-9 mobile:flex-col mobile:[align-items:start] mobile:gap-[18px]">
          <div>
            <p className="eyebrow">
              <b>(04)</b> האפליקציה
            </p>
            <h2 id="app-title" className="title">
              כל היום של הילד,
              <br />
              <span className="serif ink-tomato">בכף היד</span> של ההורה.
            </h2>
          </div>
          <p className="lead">
            חשבונות נפרדים להורים, לצוות ולמנהלת. ההרשאות נאכפות בשרת, כך שכל אחד רואה רק מה שמותר לו.
          </p>
        </div>

        <div className="reveal grid grid-cols-[300px_1fr] [align-items:start] gap-9 tablet:grid-cols-[1fr]">
          <div className="grid [align-content:start] gap-4">
            <div
              className="grid [align-content:start] gap-3 tablet:grid-cols-[repeat(3,1fr)] mobile:gap-2"
              role="tablist"
              aria-label="בחירת תפקיד"
            >
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  id={`tab-${t.id}`}
                  aria-controls="showcase-panel"
                  className={cn(roleTab, tab === t.id ? roleTabOn : roleTabOff)}
                  onClick={() => setTab(t.id)}
                >
                  <b className="text-[1.35rem] text-cocoa-deep">{t.label}</b>
                  <span className="text-[0.9rem] text-muted mobile:hidden">{t.hint}</span>
                </button>
              ))}
            </div>
            <Link className="btn btn-primary" href="/login/">
              נסו את הדמו ←
            </Link>
          </div>
          <div
            className="overflow-hidden rounded-[22px] border-2 border-cocoa-deep bg-paper shadow-[12px_14px_0_rgba(62,50,43,0.18)]"
            role="tabpanel"
            id="showcase-panel"
            aria-labelledby={`tab-${tab}`}
          >
            <div
              className="flex items-center gap-[7px] border-b-2 border-b-cocoa-deep bg-cream px-4 py-3 [direction:ltr]"
              aria-hidden="true"
            >
              {DEVICE_DOTS.map((c) => (
                <i key={c} className={cn("h-[11px] w-[11px] rounded-[50%]", c)} />
              ))}
              <small dir="ltr" className="mx-auto text-[0.8rem] font-semibold text-muted">
                ganli.co.il/app/{tab}
              </small>
            </div>
            <RoleMock tab={tab} />
          </div>
        </div>

        <h3 className="reveal [margin:96px_0_26px] text-[2.2rem] font-black mobile:mt-16">ומה עוד בפנים?</h3>
        <div className="bento grid [grid-auto-flow:dense] auto-rows-[minmax(230px,auto)] grid-cols-[repeat(4,1fr)] gap-[18px] tablet:grid-cols-[repeat(2,1fr)] mobile:auto-rows-auto mobile:grid-cols-[1fr]">
          {FEATURES.map((f, i) => (
            <article
              key={f.id}
              className={cn(featureCard, FEATURE_TINT[i] ?? "bg-paper", FEATURE_SIZE[f.size])}
              style={{ ["--d" as string]: i % 3 }}
            >
              <FeatureVisual id={f.id} />
              <h4 className="text-[1.4rem] font-extrabold tracking-[-0.03em]">{f.title}</h4>
              <p className="mt-[6px] text-[0.98rem] text-muted">{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
