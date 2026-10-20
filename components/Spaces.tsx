import { SPACES } from "@/lib/content";

// Flat illustrations for each space, drawn with the brand blocks.
const ART = [
  // Playground: sun, slide and sandbox
  <svg key="yard" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice">
    <circle cx="300" cy="110" r="60" fill="var(--mustard)" />
    <path d="M60 330h70v190H60z" fill="var(--cocoa)" />
    <path d="M130 330c90 0 120 120 230 190H300c-80-60-110-140-170-140z" fill="var(--blush)" />
    <path d="M40 320l55-60 55 60z" fill="var(--tomato)" />
    <rect x="0" y="470" width="400" height="60" fill="var(--wood)" />
  </svg>,
  // Kitchen: pot and steam
  <svg key="kitchen" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
    <path d="M250 90c-10-20 10-30 0-50M285 90c-10-20 10-30 0-50M320 90c-10-20 10-30 0-50" stroke="#fff" strokeOpacity=".5" strokeWidth="8" fill="none" strokeLinecap="round" />
    <rect x="220" y="100" width="130" height="90" rx="20" fill="var(--cocoa)" />
    <rect x="205" y="100" width="160" height="22" rx="11" fill="var(--wood)" />
    <circle cx="70" cy="60" r="34" fill="var(--mustard)" opacity=".7" />
  </svg>,
  // Art room: brush strokes and paint dots
  <svg key="art" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
    <circle cx="300" cy="70" r="30" fill="var(--teal)" />
    <circle cx="350" cy="130" r="22" fill="var(--tomato)" />
    <circle cx="260" cy="140" r="18" fill="var(--blush)" />
    <path d="M40 60c40-30 90 20 130-10" stroke="#fff" strokeOpacity=".6" strokeWidth="14" fill="none" strokeLinecap="round" />
  </svg>,
  // Library: a shelf of books
  <svg key="books" viewBox="0 0 800 260" preserveAspectRatio="xMidYMid slice">
    <rect x="420" y="70" width="44" height="130" rx="8" fill="var(--teal)" />
    <rect x="470" y="50" width="40" height="150" rx="8" fill="var(--mustard)" />
    <rect x="516" y="90" width="52" height="110" rx="8" fill="var(--cocoa)" />
    <rect x="574" y="64" width="38" height="136" rx="8" fill="var(--tomato)" transform="rotate(8 593 200)" />
    <rect x="400" y="200" width="300" height="18" rx="9" fill="var(--wood)" />
    <path d="M680 70l8 18 20 2-15 13 5 20-18-11-18 11 5-20-15-13 20-2z" fill="#fff" opacity=".6" />
  </svg>,
];

const SHAPE = ["arch", "round", "pill", "squircle"];

export default function Spaces() {
  return (
    <section className="section spaces" id="spaces" aria-labelledby="spaces-title">
      <div className="container">
        <div className="reveal">
          <p className="eyebrow">
            <b>(05)</b> המרחבים
          </p>
          <h2 id="spaces-title" className="title">
            בית שנבנה
            <br />
            <span className="serif ink-tomato">בגובה</span> העיניים.
          </h2>
        </div>
        <div className="spaces-grid">
          {SPACES.map((s, i) => (
            <article className={`space shape-${SHAPE[i]} reveal`} data-color={s.color} key={s.title} style={{ ["--d" as string]: i }}>
              <div className="space-art" aria-hidden="true">
                {ART[i]}
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
