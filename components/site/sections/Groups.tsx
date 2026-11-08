import { cn } from "@/lib/ui/cn";
import { section } from "@/components/site/ui";
import { GROUPS } from "@/content";

// A small stack of blocks per group: more blocks as the children grow.
const STACKS: React.CSSProperties[][] = [
  [{ width: 44, height: 44, bottom: 0, left: 26, background: "var(--accent)" }],
  [
    { width: 40, height: 40, bottom: 0, left: 8, background: "var(--accent)" },
    { width: 40, height: 40, bottom: 0, left: 52, background: "var(--wood)" },
    { width: 40, height: 34, bottom: 42, left: 30, background: "var(--cocoa)" },
  ],
  [
    { width: 30, height: 30, bottom: 0, left: 4, background: "var(--wood)" },
    { width: 30, height: 30, bottom: 0, left: 62, background: "var(--wood)" },
    { width: 88, height: 18, bottom: 32, left: 4, background: "var(--cocoa)" },
    { width: 34, height: 34, bottom: 52, left: 31, background: "var(--accent)" },
  ],
];

// `group` stays as the hook for high-contrast mode; no transform/transition, the card is a .reveal element.
const groupCard = "group reveal overflow-hidden rounded-[40px] bg-paper shadow-block";
const point =
  "flex items-center gap-3 text-[0.98rem] font-semibold before:h-[14px] before:w-[14px] before:flex-none before:rounded-[4px] before:bg-(--accent) before:[transform:rotate(45deg)] before:content-['']";

/** The age groups. */
export default function Groups() {
  return (
    <section className={section} id="groups" aria-labelledby="groups-title">
      <div className="container">
        <div className="reveal">
          <p className="eyebrow">
            <b>(03)</b> הקבוצות
          </p>
          <h2 id="groups-title" className="title">
            לכל גיל, <span className="serif ink-tomato">מקום</span>
            <br />
            משלו.
          </h2>
        </div>
        <div className="mt-[70px] grid grid-cols-[repeat(3,1fr)] [align-items:start] gap-[26px] mobile:mt-[46px] mobile:grid-cols-[1fr] mobile:gap-[22px]">
          {GROUPS.map((g, i) => (
            <article
              className={cn(groupCard, i === 1 && "mt-14 mobile:mt-0")}
              data-color={g.color}
              key={g.name}
              style={{ ["--d" as string]: i }}
            >
              <div className="relative [margin:14px_14px_0] grid h-[250px] place-items-center overflow-hidden rounded-[999px_999px_26px_26px] bg-(--accent) mobile:h-[210px]">
                <span className="serif text-center text-[6.4rem] leading-[0.8] text-cocoa-deep xs:text-[5.2rem]">
                  {g.from}
                  <small className="mt-2 block tracking-[0] [font:700_0.9rem/1.4_var(--font-body)]">חודשים ומעלה</small>
                </span>
                <div className="absolute start-[18px] bottom-0 h-[100px] w-[100px]" aria-hidden="true">
                  {STACKS[i].map((style, j) => (
                    <i key={j} style={style} className="absolute rounded-[8px] shadow-[0_4px_0_rgba(62,50,43,0.18)]" />
                  ))}
                </div>
              </div>
              <div className="grid gap-3 [padding:26px_30px_34px]">
                <h3 className="text-[2.6rem] tracking-[-0.04em]">{g.name}</h3>
                <span className="[justify-self:start] rounded-[999px] bg-(--accent-soft) px-[14px] py-[6px] text-[0.9rem] font-bold text-cocoa-deep">
                  {g.ages}
                </span>
                <p className="text-[1.02rem] text-muted">{g.text}</p>
                <ul className="mt-[6px] grid list-none gap-2 p-0">
                  {g.points.map((p) => (
                    <li key={p} className={point}>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
