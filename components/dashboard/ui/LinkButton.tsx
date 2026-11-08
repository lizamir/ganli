import type { ComponentProps } from "react";
import { cn } from "@/lib/ui/cn";

/** A button that looks like a text link. `light` is for dark backgrounds. */
export default function LinkButton({
  className,
  light,
  type = "button",
  ...props
}: ComponentProps<"button"> & { light?: boolean }) {
  return (
    <button
      type={type}
      className={cn(
        "p-1.5 font-heading text-[0.9375rem]/[normal] font-semibold text-teal-deep [background:none] [border:0]",
        light && "text-white",
        className,
      )}
      {...props}
    />
  );
}
