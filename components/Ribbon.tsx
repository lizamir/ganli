const ROW_A = ["משחקים", "לומדים", "יוצרים", "שרים", "חוקרים", "גדלים", "צוחקים", "ביחד"];
const ROW_B = ["קוביות", "צבעים", "חול", "מים", "סיפורים", "שירים", "בועות", "כוכבים"];

function Row({ words, reverse, outline }: { words: string[]; reverse?: boolean; outline?: boolean }) {
  const items = [...words, ...words];
  return (
    <div className={`ribbon-row${reverse ? " rev" : ""}${outline ? " outline" : ""}`}>
      <div className="ribbon-track">
        {items.map((w, i) => (
          <span key={i}>
            {w}
            <i aria-hidden="true">✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two slanted marquee bands. Decorative, so hidden from screen readers. */
export default function Ribbon() {
  return (
    <div className="ribbon" aria-hidden="true">
      <Row words={ROW_A} />
      <Row words={ROW_B} reverse outline />
    </div>
  );
}
