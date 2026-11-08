import HeroStage from "@/components/site/scene/HeroStage";
import { HERO } from "@/content";
import { Star } from "@/components/common/Shapes";
import { cn } from "@/lib/ui/cn";

// Soft color pools behind the hero, on cream.
const heroBg =
  "[background:radial-gradient(circle_at_12%_28%,var(--mustard-soft)_0,transparent_38%),radial-gradient(circle_at_4%_92%,var(--teal-soft)_0,transparent_34%),radial-gradient(circle_at_96%_8%,var(--blush-soft)_0,transparent_30%),var(--cream)]";
const star = "absolute";
const STAT_INK = ["text-tomato-ink", "text-teal-deep", "text-mustard-ink"];

/** The first screen of the marketing site. */
export default function Hero() {
  return (
    <section
      className={cn(
        "relative isolate grid min-h-[100svh] items-center overflow-hidden [padding:132px_0_96px] mobile:min-h-0 mobile:[padding:108px_0_80px]",
        heroBg,
      )}
      id="top"
      aria-labelledby="hero-title"
    >
      <div className="pointer-events-none absolute inset-0 z-[-1]" aria-hidden="true">
        <span className="absolute inset-x-0 bottom-[-0.16em] text-center tracking-[-0.07em] whitespace-nowrap text-transparent select-none [-webkit-text-stroke:2px_rgba(62,50,43,0.09)] [font:900_clamp(11rem,34vw,36rem)/0.8_var(--font-display)] mobile:text-[46vw] touch:hidden">
          גנלי
        </span>
        <svg
          className="absolute inset-0 h-full w-full [&_path]:fill-none [&_path]:stroke-wood [&_path]:[stroke-width:3] [&_path]:opacity-55 [&_path]:[stroke-linecap:round]"
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
        >
          <path d="M-20 120C160 40 300 200 520 120S760 60 840 100" />
          <path d="M-20 260C140 200 320 340 540 250S780 220 840 250" />
          <path d="M-20 420C200 360 340 500 560 410S760 380 840 400" />
        </svg>
        <Star
          className={cn(star, "start-[48%] top-[22%] w-[44px] animate-[floaty_7s_ease-in-out_infinite]")}
          color="var(--mustard)"
        />
        <Star
          className={cn(star, "start-[6%] bottom-[20%] w-[30px] animate-[floaty_7s_ease-in-out_-2s_infinite]")}
          color="var(--teal)"
        />
        <Star
          className={cn(star, "end-[4%] top-[14%] w-[34px] animate-[floaty_7s_ease-in-out_-4s_infinite]")}
          color="var(--blush)"
        />
      </div>

      <div className="container grid grid-cols-[1.08fr_0.92fr] items-center gap-14 mobile:grid-cols-[1fr] mobile:gap-16">
        <div data-in>
          <p className="eyebrow reveal">
            <span className="live-dot" aria-hidden="true" /> {HERO.eyebrow}
          </p>
          <h1 id="hero-title" className="display [margin:22px_0_28px]">
            <span className="mask">
              <span style={{ ["--i" as string]: 0, ["--base" as string]: "150ms" }}>
                כאן <span className="serif ink-tomato">משחקים</span>,
              </span>
            </span>
            <span className="mask">
              <span style={{ ["--i" as string]: 1, ["--base" as string]: "150ms" }}>לומדים</span>
            </span>
            <span className="mask">
              <span style={{ ["--i" as string]: 2, ["--base" as string]: "150ms" }}>
                וגדלים{" "}
                <span className="squiggle">
                  ביחד
                  <svg viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M4 12C60 3 120 3 160 9s100 6 136-3" pathLength="1" />
                  </svg>
                </span>
                .
              </span>
            </span>
          </h1>
          <p className="lead reveal max-w-[30rem]" style={{ ["--d" as string]: 4 }}>
            גנלי הוא בית שני לילדים בגילאי 6 חודשים עד 3 שנים. קבוצות קטנות, צוות חם ויום שלם של משחק, סקרנות וגילוי.
            ולהורים: אפליקציה שמראה את היום של הילד בזמן אמת.
          </p>
          <div className="reveal mt-9 flex flex-wrap gap-[14px]" style={{ ["--d" as string]: 5 }}>
            <a className="btn btn-primary xs:flex-[1_1_100%]" href="#contact">
              בואו לבקר אותנו ←
            </a>
            <a className="btn btn-ghost xs:flex-[1_1_100%]" href="#app">
              להציץ באפליקציה
            </a>
          </div>
          <ul
            className="reveal mt-[52px] flex list-none flex-wrap gap-[14px] p-0 xs:gap-2.5"
            style={{ ["--d" as string]: 6 }}
          >
            {HERO.stats.map((s, i) => (
              <li
                className="stat grid min-w-[132px] rounded-[22px] bg-paper px-[22px] py-[14px] shadow-block xs:min-w-0 xs:flex-[1_1_28%] xs:px-[14px] xs:py-3"
                key={s.label}
              >
                <b
                  className={cn("serif text-[2.1rem] leading-[1.1] xs:text-[1.6rem]", STAT_INK[i] ?? "text-cocoa-deep")}
                >
                  {s.value}
                </b>
                <span className="text-[0.875rem] text-muted">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <HeroStage />
      </div>

      <a
        className="absolute start-1/2 bottom-5 grid [transform:translateX(50%)] justify-items-center gap-2 text-[0.8rem] font-bold tracking-[0.1em] text-muted mobile:hidden"
        href="#story"
        aria-label="לגלול להמשך"
      >
        <span>גללו</span>
        <i aria-hidden="true" className="h-9 w-[2px] animate-[cue_2.2s_ease-in-out_infinite] bg-cocoa-deep" />
      </a>
    </section>
  );
}
