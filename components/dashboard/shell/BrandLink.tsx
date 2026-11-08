import Link from "next/link";
import { LogoMark } from "@/components/common/Shapes";
import { cn } from "@/lib/ui/cn";

/** The logo, linking back to the marketing site. `top` is the smaller version in the phone's top bar. */
export default function BrandLink({ top }: { top?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 px-2 [&>svg]:w-[46px]", top && "mobile:p-0 mobile:[&>svg]:w-[38px]")}
      aria-label="גנלי — לאתר"
    >
      <LogoMark />
      <b
        className={cn(
          "font-heading text-[1.875rem]/none font-bold text-cream",
          top && "mobile:text-[1.4rem] mobile:text-cocoa-deep",
        )}
      >
        גנלי
      </b>
    </Link>
  );
}
