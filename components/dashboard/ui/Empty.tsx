import type { ReactNode } from "react";

/** A quiet message for a list with nothing in it yet. */
export default function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-[20px] bg-paper p-[30px] text-center text-subtle">{children}</p>;
}
