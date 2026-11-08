import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type Props = { title?: string; note?: ReactNode; children: ReactNode; className?: string; tint?: string };

/** The basic surface of the personal area, with an optional title and note. */
export default function Card({ title, note, children, className, tint }: Props) {
  return (
    <section
      className={cn("dcard min-w-0 rounded-[26px] bg-paper p-6 shadow-card mobile:p-[18px]", className)}
      style={tint ? { background: tint } : undefined}
    >
      {title && (
        <header className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-[1.375rem]">{title}</h2>
          {note && <span className="text-[0.875rem] text-subtle [&_a]:font-semibold [&_a]:text-teal-deep">{note}</span>}
        </header>
      )}
      {children}
    </section>
  );
}
