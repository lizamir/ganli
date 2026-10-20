"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useSyncExternalStore } from "react";
import { STORY } from "@/lib/content";
import { useMotionOff } from "@/lib/a11y";
import { useOnScreen, useScrollProgress } from "@/lib/scroll";
import { LogoMark } from "./Shapes";

const BlocksScene = dynamic(() => import("./BlocksScene"), {
  ssr: false,
  loading: () => (
    <div className="fallback">
      <LogoMark />
    </div>
  ),
});

function Accent({ line, word }: { line: string; word: string }) {
  const i = line.indexOf(word);
  if (i < 0) return <>{line}</>;
  return (
    <>
      {line.slice(0, i)}
      <span className="serif story-accent">{word}</span>
      {line.slice(i + word.length)}
    </>
  );
}

const chapterAt = (p: number) => STORY.reduce((idx, c, i) => (p >= c.from ? i : idx), 0);

/** Scrollytelling: the castle is built block by block as the visitor scrolls, one chapter per layer. */
export default function Story() {
  const ref = useRef<HTMLElement>(null);
  const fully = useRef(1);
  const [active, setActive] = useState(0);
  const motionOff = useMotionOff();
  const { visible, listeners } = useOnScreen(ref, "100px");
  const onScreen = useSyncExternalStore(
    (l) => {
      listeners.current.add(l);
      return () => listeners.current.delete(l);
    },
    () => visible.current,
    () => false
  );

  const progress = useScrollProgress(
    ref,
    (p, el) => {
      el.style.setProperty("--p", p.toFixed(4));
      const idx = chapterAt(p);
      setActive((prev) => (prev === idx ? prev : idx));
    },
    !motionOff
  );

  const chapter = STORY[motionOff ? 0 : active];

  return (
    <section ref={ref} id="story" className={`story${motionOff ? " static" : ""}`} aria-labelledby="story-title">
      <div className="story-sticky" style={{ ["--bg" as string]: motionOff ? "var(--cream)" : chapter.color }}>
        <div className="container story-grid">
          <div className="story-copy">
            <p className="eyebrow" id="story-title">
              <b>(01)</b> הגישה שלנו
            </p>

            <div className="chapters">
              {STORY.map((c, i) => (
                <article key={c.no} className={`chapter${!motionOff && i === active ? " on" : ""}`}>
                  <h2 className="title">
                    {c.title.map((line, j) => (
                      <span className="line" key={j}>
                        <Accent line={line} word={c.accent} />
                      </span>
                    ))}
                  </h2>
                  <p className="lead">{c.text}</p>
                  <ul className="chips">
                    {c.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            {!motionOff && (
              <ol className="steps" aria-hidden="true">
                {STORY.map((c, i) => (
                  <li key={c.no} className={i <= active ? "done" : undefined}>
                    <span className="serif">{c.no}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="story-stage">
            <div className="arch-window" role="img" aria-label="טירת קוביות שנבנית בהדרגה בזמן הגלילה" data-cursor="בנו">
              <BlocksScene animate={!motionOff} progress={motionOff ? fully : progress} active={onScreen || motionOff} />
            </div>
            <div className="story-meter" aria-hidden="true">
              <i style={{ transform: "scaleX(calc(var(--p, 0)))" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
