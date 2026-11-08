import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

/** The top line of a message: who or what on one side, when on the other. */
export default function MessageHeader({
  title,
  time,
  className,
}: {
  title: ReactNode;
  time: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full justify-between gap-2.5", className)}>
      <b className="font-heading text-[1.125rem]/[normal] font-semibold">{title}</b>
      <time className="text-[0.875rem] text-subtle">{time}</time>
    </div>
  );
}
