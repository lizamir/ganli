import HeroStage from "./HeroStage";
import { HERO } from "@/lib/content";
import { Star } from "./Shapes";

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-wordmark">גנלי</span>
        <svg className="grain-lines" viewBox="0 0 800 600" preserveAspectRatio="none">
          <path d="M-20 120C160 40 300 200 520 120S760 60 840 100" />
          <path d="M-20 260C140 200 320 340 540 250S780 220 840 250" />
          <path d="M-20 420C200 360 340 500 560 410S760 380 840 400" />
        </svg>
        <Star className="bg-star s1" color="var(--mustard)" />
        <Star className="bg-star s2" color="var(--teal)" />
        <Star className="bg-star s3" color="var(--blush)" />
      </div>

      <div className="container hero-grid">
        <div className="hero-copy" data-in>
          <p className="eyebrow reveal">
            <span className="live-dot" aria-hidden="true" /> {HERO.eyebrow}
          </p>
          <h1 id="hero-title" className="display">
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
          <p className="lead reveal" style={{ ["--d" as string]: 4 }}>
            גנלי הוא בית שני לילדים בגילאי 6 חודשים עד 3 שנים. קבוצות קטנות, צוות חם ויום שלם של משחק, סקרנות וגילוי. ולהורים: אפליקציה שמראה
            את היום של הילד בזמן אמת.
          </p>
          <div className="hero-actions reveal" style={{ ["--d" as string]: 5 }}>
            <a className="btn btn-primary" href="#contact">
              בואו לבקר אותנו ←
            </a>
            <a className="btn btn-ghost" href="#app">
              להציץ באפליקציה
            </a>
          </div>
          <ul className="hero-stats reveal" style={{ ["--d" as string]: 6 }}>
            {HERO.stats.map((s) => (
              <li className="stat" key={s.label}>
                <b className="serif">{s.value}</b>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <HeroStage />
      </div>

      <a className="scroll-cue" href="#story" aria-label="לגלול להמשך">
        <span>גללו</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
