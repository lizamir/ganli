"use client";

import dynamic from "next/dynamic";
import { useRef, useSyncExternalStore } from "react";
import { LogoMark } from "./Shapes";
import { useMotionOff } from "@/lib/a11y";
import { useOnScreen } from "@/lib/scroll";

const Fallback = () => (
  <div className="fallback">
    <LogoMark />
  </div>
);

const BlocksScene = dynamic(() => import("./BlocksScene"), { ssr: false, loading: Fallback });

/** The doorway: the 3D castle inside an arch-shaped window, with stickers and a rotating wordmark. */
export default function HeroStage() {
  const motionOff = useMotionOff();
  const ref = useRef<HTMLDivElement>(null);
  const { visible, listeners } = useOnScreen(ref);
  const active = useSyncExternalStore(
    (l) => {
      listeners.current.add(l);
      return () => listeners.current.delete(l);
    },
    () => visible.current,
    () => true
  );

  return (
    <div className="hero-stage" ref={ref}>
      <div className="arch-window" role="img" aria-label="טירת קוביות עץ בתלת ממד. אפשר ללחוץ על הקוביות" data-cursor="לחצו">
        <BlocksScene animate={!motionOff} active={active} />
      </div>

      <svg className="spin-badge" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1 -156 0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="var(--cocoa-deep)" />
        <text className="badge-text" direction="ltr">
          <textPath href="#badge-circle" startOffset="0">
            משחקים ✦ לומדים ✦ גדלים ✦ משחקים ✦ לומדים ✦ גדלים ✦
          </textPath>
        </text>
        <path d="M100 74l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="var(--mustard)" />
      </svg>

      <div className="sticker sticker-age" aria-hidden="true">
        <span className="serif">3</span>
        <small>עד גיל</small>
      </div>

      <div className="live-chip" aria-hidden="true">
        <span className="live-dot" />
        <div>
          <b>עכשיו בגן</b>
          <small>8 ילדים נוכחים · קבוצת מגדלים ישנה</small>
        </div>
        <em>דוגמה מהאפליקציה</em>
      </div>

      <p className="stage-hint hand" aria-hidden="true">
        <span>לחצו על הקוביות!</span>
        <svg viewBox="0 0 70 40">
          <path d="M6 8C24 4 46 12 60 30m0 0l-2-13m2 13l-13-3" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </p>
    </div>
  );
}
