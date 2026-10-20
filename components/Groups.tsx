import { GROUPS } from "@/lib/content";

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

export default function Groups() {
  return (
    <section className="section groups" id="groups" aria-labelledby="groups-title">
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
        <div className="groups-grid">
          {GROUPS.map((g, i) => (
            <article className="group reveal" data-color={g.color} key={g.name} style={{ ["--d" as string]: i }}>
              <div className="group-arch">
                <span className="group-age serif">
                  {g.from}
                  <small>חודשים ומעלה</small>
                </span>
                <div className="group-blocks" aria-hidden="true">
                  {STACKS[i].map((style, j) => (
                    <i key={j} style={style} />
                  ))}
                </div>
              </div>
              <div className="group-body">
                <h3>{g.name}</h3>
                <span className="ages">{g.ages}</span>
                <p>{g.text}</p>
                <ul>
                  {g.points.map((p) => (
                    <li key={p}>{p}</li>
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
