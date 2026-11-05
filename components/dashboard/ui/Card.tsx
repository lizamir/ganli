import type { ReactNode } from "react";

type Props = { title?: string; note?: ReactNode; children: ReactNode; className?: string; tint?: string };

/** The basic surface of the personal area, with an optional title and note. */
export default function Card({ title, note, children, className = "", tint }: Props) {
  return (
    <section className={`dcard ${className}`} style={tint ? { background: tint } : undefined}>
      {title && (
        <header className="dcard-head">
          <h2>{title}</h2>
          {note && <span>{note}</span>}
        </header>
      )}
      {children}
    </section>
  );
}
