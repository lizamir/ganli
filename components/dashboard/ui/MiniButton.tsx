import type { ComponentProps } from "react";
import { cn } from "@/lib/ui/cn";

/** Small rounded button classes, for buttons and links that look like buttons. */
export const miniButton =
  "rounded-[999px] [border:0] bg-sand px-3.5 py-2 font-heading text-sm/none font-semibold whitespace-nowrap text-cocoa-deep hover:bg-wood disabled:opacity-60";

/** A small rounded action button. */
export default function MiniButton({ className, type = "button", ...props }: ComponentProps<"button">) {
  return <button type={type} className={cn(miniButton, className)} {...props} />;
}
