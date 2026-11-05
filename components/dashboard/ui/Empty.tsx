import type { ReactNode } from "react";

/** A quiet message for a list with nothing in it yet. */
export default function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}
