import { cn } from "@/lib/ui/cn";

const ROW_A = ["משחקים", "לומדים", "יוצרים", "שרים", "חוקרים", "גדלים", "צוחקים", "ביחד"];
const ROW_B = ["קוביות", "צבעים", "חול", "מים", "סיפורים", "שירים", "בועות", "כוכבים"];

/** One moving row of words. */
function Row({ words, reverse, outline }: { words: string[]; reverse?: boolean; outline?: boolean }) {
  const items = [...words, ...words];
  return (
    <div className="overflow-hidden [direction:ltr]">
      <div
        className={cn(
          "flex w-max tracking-[-0.035em] [font:900_clamp(2rem,5.4vw,4.4rem)/1.15_var(--font-display)] group-hover/ribbon:[animation-play-state:paused]",
          reverse ? "animate-[marq_58s_linear_infinite_reverse]" : "animate-[marq_46s_linear_infinite]",
        )}
      >
        {items.map((w, i) => (
          <span
            key={i}
            className={cn(
              "inline-flex items-center gap-[0.5em] px-[0.3em] whitespace-nowrap",
              outline && "text-transparent [-webkit-text-stroke:1.6px_var(--cream)]",
            )}
          >
            {w}
            <i aria-hidden="true" className="text-[0.55em] text-mustard not-italic [-webkit-text-stroke:0]">
              ✦
            </i>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two slanted marquee bands. Decorative, so hidden from screen readers. */
export default function Ribbon() {
  return (
    <div
      className="group/ribbon relative z-3 [margin:-34px_-3vw_0] [transform:rotate(-1.4deg)] overflow-hidden bg-cocoa-deep pt-2 pb-3 text-cream shadow-[0_20px_40px_-20px_rgba(62,50,43,0.5)]"
      aria-hidden="true"
    >
      <Row words={ROW_A} />
      <Row words={ROW_B} reverse outline />
    </div>
  );
}
