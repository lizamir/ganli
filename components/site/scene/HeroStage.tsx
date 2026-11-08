"use client";

import dynamic from "next/dynamic";
import { useRef, useSyncExternalStore } from "react";
import { LogoMark } from "@/components/common/Shapes";
import { useMotionOff } from "@/lib/stores/a11y";
import { useOnScreen } from "@/lib/hooks/scroll";

/** What shows until the 3D scene loads. */
const Fallback = () => (
  <div className="absolute inset-0 grid place-items-center [&_svg]:w-[56%]">
    <LogoMark />
  </div>
);

const BlocksScene = dynamic(() => import("@/components/site/scene/BlocksScene"), { ssr: false, loading: Fallback });

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
    () => true,
  );

  return (
    <div className="relative mx-auto w-full max-w-[540px] mobile:max-w-[420px]" ref={ref}>
      <div
        className="arch-window"
        role="img"
        aria-label="טירת קוביות עץ בתלת ממד. אפשר ללחוץ על הקוביות"
        data-cursor="לחצו"
      >
        <BlocksScene animate={!motionOff} active={active} />
      </div>

      <svg
        className="absolute start-[-36px] top-[-22px] z-2 w-[140px] animate-[spin_24s_linear_infinite] mobile:start-[-10px] mobile:w-[104px]"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <defs>
          <path id="badge-circle" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1 -156 0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="var(--cocoa-deep)" />
        <text className="fill-cream tracking-[0.05em] [font:800_17px_var(--font-display)]" direction="ltr">
          <textPath href="#badge-circle" startOffset="0">
            משחקים ✦ לומדים ✦ גדלים ✦ משחקים ✦ לומדים ✦ גדלים ✦
          </textPath>
        </text>
        <path d="M100 74l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="var(--mustard)" />
      </svg>

      <div
        className="absolute end-[-28px] bottom-[20%] z-2 grid h-24 w-24 [transform:rotate(12deg)] place-content-center rounded-[50%] bg-mustard text-center text-cocoa-deep shadow-block mobile:end-[-6px] mobile:h-20 mobile:w-20"
        aria-hidden="true"
      >
        <span className="serif text-[2.8rem] leading-[0.9] mobile:text-[2.2rem]">3</span>
        <small className="text-[0.75rem] font-bold">עד גיל</small>
      </div>

      <div
        className="absolute start-[-34px] bottom-[-20px] z-2 flex max-w-[300px] animate-[bob_6s_ease-in-out_infinite] items-center gap-3 rounded-[22px] bg-paper px-[18px] py-3 shadow-block mobile:start-[-8px]"
        aria-hidden="true"
      >
        <span className="live-dot" />
        <div>
          <b className="block text-[1rem] leading-[1.2] text-cocoa-deep">עכשיו בגן</b>
          <small className="block text-[0.8rem] leading-[1.3] text-muted">8 ילדים נוכחים · קבוצת מגדלים ישנה</small>
        </div>
        <em className="absolute end-3 top-[-10px] rounded-[999px] bg-cocoa-deep px-[9px] py-[3px] text-[0.7rem] font-bold text-cream not-italic">
          דוגמה מהאפליקציה
        </em>
      </div>

      <p
        className="hand pointer-events-none absolute top-[calc(100%_+_30px)] left-[4%] z-2 flex [transform:rotate(-4deg)] items-center gap-2 text-[1.7rem] leading-none text-tomato-ink min-[1420px]:top-[40%] min-[1420px]:right-[calc(100%_+_6px)] min-[1420px]:left-auto min-[1420px]:w-20 min-[1420px]:[transform:rotate(-7deg)] min-[1420px]:flex-col min-[1420px]:text-center min-[1420px]:text-[1.35rem] mobile:top-[calc(100%_+_34px)]"
        aria-hidden="true"
      >
        <span>לחצו על הקוביות!</span>
        <svg
          viewBox="0 0 70 40"
          className="w-[54px] flex-none [transform:rotate(-90deg)] min-[1420px]:[transform:none]"
        >
          <path
            d="M6 8C24 4 46 12 60 30m0 0l-2-13m2 13l-13-3"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </p>
    </div>
  );
}
