"use client";

import { useState } from "react";
import { DAY } from "@/lib/content";
import { Arch, Half, Square, Triangle } from "./Shapes";

const SHAPES = [Square, Arch, Triangle, Half];
const COLORS = ["var(--mustard)", "var(--tomato)", "var(--teal)", "var(--blush)"];

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
    if (window.innerWidth <= 900) requestAnimationFrame(() => document.getElementById("day-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  // In a right-to-left page the next hour is to the left.
  const onKey = (e: React.KeyboardEvent) => {
    const next = e.key === "ArrowLeft" ? i + 1 : e.key === "ArrowRight" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (next === null) return;
    e.preventDefault();
    go(next);
    document.getElementById(`day-tab-${((next % n) + n) % n}`)?.focus();
  };

  return (
    <section id="day" className="day" aria-labelledby="day-title">
      <div className="container">
        <div className="day-head">
          <div>
            <p className="eyebrow">
              <b>(02)</b> יום בגן
            </p>
            <h2 id="day-title" className="title">
              מהבוקר ועד האיסוף,
              <br />
              <span className="serif ink-tomato">יום מלא</span> הרפתקאות.
            </h2>
          </div>
          <p className="lead">שגרה קבועה ורגועה שנותנת לילדים ביטחון. בחרו שעה וראו מה קורה בגן.</p>
        </div>

        <div className="sky" aria-hidden="true" style={{ ["--p" as string]: (i + 0.5) / n }}>
          <span className="sun" />
        </div>

        <div className="day-times" role="tablist" aria-label="שעות ביום בגן" onKeyDown={onKey}>
          {DAY.map((d, k) => (
            <button
              key={d.time}
              type="button"
              role="tab"
              id={`day-tab-${k}`}
              aria-selected={k === i}
              aria-controls="day-panel"
              tabIndex={k === i ? 0 : -1}
              className={k === i ? "on" : undefined}
              onClick={() => {
                setI(k);
                reveal();
              }}
            >
              <span className="serif">{d.time}</span>
            </button>
          ))}
        </div>

        <div className="day-panel" role="tabpanel" id="day-panel" aria-labelledby={`day-tab-${i}`} style={{ ["--c" as string]: COLORS[i % COLORS.length] }}>
          <div className="day-card" key={i}>
            <div className="day-card-art" aria-hidden="true">
              <Shape className="day-shape" color="var(--c)" />
              <time className="serif">{slot.time}</time>
            </div>
            <div className="day-card-body">
              <p className="day-count" aria-hidden="true">
                {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </p>
              <h3>{slot.title}</h3>
              <p>{slot.text}</p>
            </div>
          </div>
          <div className="day-nav">
            <button type="button" onClick={() => go(i - 1)} aria-label="השעה הקודמת">
              →
            </button>
            <button type="button" onClick={() => go(i + 1)} aria-label="השעה הבאה">
              ←
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
