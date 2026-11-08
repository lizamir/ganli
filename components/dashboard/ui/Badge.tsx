import type { ReactNode } from "react";
import type { Tone } from "@/lib/domain/types";
import { TONE_CLASS } from "@/lib/ui/tones";
import { cn } from "@/lib/ui/cn";

/** A small colored status label. */
export default function Badge({
  tone = "mute",
  children,
  dot,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "badge inline-flex items-center gap-1.5 rounded-[999px] px-[11px] py-[5px] font-heading text-[0.8125rem]/[1.3] font-semibold whitespace-nowrap",
        TONE_CLASS[tone],
        className,
      )}
    >
      {dot && <i className="size-2 rounded-[50%] bg-current" />}
      {children}
    </span>
  );
}
