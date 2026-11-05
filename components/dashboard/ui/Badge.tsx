import type { ReactNode } from "react";
import type { Tone } from "@/lib/domain/types";

/** A small colored status label. */
export default function Badge({ tone = "mute", children, dot }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span className={`badge tone-${tone}`}>
      {dot && <i />}
      {children}
    </span>
  );
}
