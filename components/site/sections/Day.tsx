"use client";

import { useState } from "react";
import { DAY } from "@/content";
import { Arch, Half, Square, Triangle } from "@/components/common/Shapes";
import { cn } from "@/lib/ui/cn";

const SHAPES = [Square, Arch, Triangle, Half];
const COLORS = ["var(--mustard)", "var(--tomato)", "var(--teal)", "var(--blush)"];

const hourTab =
  "min-h-[56px] rounded-[16px] border-2 text-[1.5rem] [direction:ltr] [transition:background_0.25s,color_0.25s,border-color_0.25s,transform_0.3s_var(--ease-spring)] mobile:min-h-[52px] mobile:text-[1.3rem]";
const hourTabOn = "border-cream bg-cream text-cocoa-deep";
const hourTabOff =
  "border-[rgba(255,255,255,0.18)] [background:transparent] text-cream hover:border-mustard hover:[transform:translateY(-3px)]";
const stepButton =
  "h-[58px] w-[58px] rounded-[50%] [border:0] bg-mustard text-[1.6rem] font-extrabold text-cocoa-deep shadow-[0_4px_0_rgba(0,0,0,0.3)] [transition:transform_0.25s_var(--ease-spring)] hover:[transform:translateY(-3px)] active:[transform:translateY(1px)]";

/** The day, one hour at a time. The visitor picks an hour (or steps with the arrows); the sun moves
 *  along the sky and the card for that hour opens. Nothing hijacks the page scroll. */
export default function Day() {
  const [i, setI] = useState(0);
  const n = DAY.length;
  const slot = DAY[i];
  const Shape = SHAPES[i % SHAPES.length];
  const go = (k: number) => setI(((k % n) + n) % n);
  // On phones the card sits below the fold: bring it into view after a choice (only if it is not fully visible).
  const reveal = () => {
    if (window.innerWidth <= 900)
      requestAnimationFrame(() =>
        document.getElementById("day-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
      );
  };

  // In a right-to-left page the next hour is to the left.
  const onKey = (e: React.KeyboardEvent) => {
    const next =
      e.key === "ArrowLeft"
        ? i + 1
        : e.key === "ArrowRight"
          ? i - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    go(next);
    document.getElementById(`day-tab-${((next % n) + n) % n}`)?.focus();
  };

  return (
    <section
      id="day"
      className="relative bg-cocoa-deep [padding:110px_0_120px] text-cream mobile:[padding:84px_0_90px]"
      aria-labelledby="day-title"
    >
      <div className="container">
        <div className="mb-11 flex [align-items:end] justify-between gap-10 mobile:mb-[30px] mobile:flex-col mobile:[align-items:start] mobile:gap-[18px]">
          <div>
            <p className="eyebrow text-mustard-soft [&_b]:text-mustard">
              <b>(02)</b> יום בגן
            </p>
            <h2 id="day-title" className="title text-cream">
              מהבוקר ועד האיסוף,
              <br />
              <span className="serif text-blush">יום מלא</span> הרפתקאות.
            </h2>
          </div>
          <p className="lead text-side-text">שגרה קבועה ורגועה שנותנת לילדים ביטחון. בחרו שעה וראו מה קורה בגן.</p>
        </div>

        <div
          className="relative h-[78px] overflow-hidden rounded-[999px] [background:linear-gradient(90deg,#ffd98a_0%,#a8d8f0_36%,#a8d8f0_62%,#f3a59b_86%,#6b5fb5_100%)] mobile:h-[62px]"
          aria-hidden="true"
          style={{ ["--p" as string]: (i + 0.5) / n }}
        >
          <span className="absolute start-[calc(var(--p,0)*100%_-_22px)] top-1/2 h-11 w-11 [transform:translateY(-50%)] rounded-[50%] bg-[#fff6d6] shadow-[0_0_0_10px_rgba(255,246,214,0.4),0_0_44px_12px_rgba(255,214,120,0.85)] [transition:inset-inline-start_0.7s_var(--ease-out)]" />
        </div>

        <div
          className="mt-[14px] grid grid-cols-[repeat(8,1fr)] gap-2 mobile:grid-cols-[repeat(4,1fr)]"
          role="tablist"
          aria-label="שעות ביום בגן"
          onKeyDown={onKey}
        >
          {DAY.map((d, k) => (
            <button
              key={d.time}
              type="button"
              role="tab"
              id={`day-tab-${k}`}
              aria-selected={k === i}
              aria-controls="day-panel"
              tabIndex={k === i ? 0 : -1}
              className={cn(hourTab, k === i ? hourTabOn : hourTabOff)}
              onClick={() => {
                setI(k);
                reveal();
              }}
            >
              <span className="serif text-[1.1em]">{d.time}</span>
            </button>
          ))}
        </div>

        <div
          className="mt-[26px] grid gap-[14px]"
          role="tabpanel"
          id="day-panel"
          aria-labelledby={`day-tab-${i}`}
          style={{ ["--c" as string]: COLORS[i % COLORS.length] }}
        >
          <div
            className="grid min-h-[260px] animate-[day-in_0.55s_var(--ease-out)] grid-cols-[0.9fr_1.3fr] items-center gap-10 rounded-[36px] bg-paper [padding:36px_44px] text-cocoa shadow-[0_10px_0_rgba(0,0,0,0.28)] mobile:grid-cols-[1fr] mobile:justify-items-center mobile:gap-[14px] mobile:[padding:26px_22px] mobile:text-center"
            key={i}
          >
            <div className="grid justify-items-center gap-[6px]" aria-hidden="true">
              <Shape className="h-[84px] w-[84px] mobile:h-16 mobile:w-16" color="var(--c)" />
              <time className="serif text-[6rem] leading-[0.85] text-cocoa-deep [direction:ltr] mobile:text-[4.6rem]">
                {slot.time}
              </time>
            </div>
            <div className="grid gap-2">
              <p className="text-[0.9rem] font-bold tracking-[0.1em] text-muted" aria-hidden="true">
                {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </p>
              <h3 className="text-[2.6rem] tracking-[-0.04em] text-cocoa-deep mobile:text-[2rem]">{slot.title}</h3>
              <p className="max-w-[30rem] text-[1.2rem] text-muted mobile:text-[1.05rem]">{slot.text}</p>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button type="button" className={stepButton} onClick={() => go(i - 1)} aria-label="השעה הקודמת">
              →
            </button>
            <button type="button" className={stepButton} onClick={() => go(i + 1)} aria-label="השעה הבאה">
              ←
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
