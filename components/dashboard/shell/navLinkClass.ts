import { cn } from "@/lib/ui/cn";

/** A link of the desktop sidebar. */
export const sideLink = (active: boolean) =>
  cn(
    "flex items-center gap-3 rounded-[14px] px-3.5 py-3 font-heading text-[1.0625rem]/none font-medium transition-[background] duration-200 ease-[ease] mobile:whitespace-nowrap",
    active ? "bg-mustard text-cocoa-deep" : "text-side-text hover:bg-[rgba(255,255,255,0.07)]",
  );

/** A link of the phone's bottom tabs. */
export const tabLink = (active: boolean) =>
  cn(
    "mobile:grid mobile:min-h-14 mobile:content-center mobile:justify-items-center mobile:gap-0.5 mobile:rounded-[16px] mobile:text-[0.72rem] mobile:font-bold mobile:[border:0]",
    active ? "mobile:bg-mustard-soft mobile:text-cocoa-deep" : "mobile:text-muted mobile:[background:none]",
  );

/** A link in the phone's sheet. */
export const sheetLink = (active: boolean) =>
  cn(
    "mobile:flex mobile:min-h-[52px] mobile:items-center mobile:gap-3 mobile:rounded-[14px] mobile:p-3.5 mobile:font-heading mobile:text-[1.05rem]/[normal] mobile:font-semibold",
    active ? "mobile:bg-mustard mobile:text-cocoa-deep" : "mobile:text-side-text",
  );
