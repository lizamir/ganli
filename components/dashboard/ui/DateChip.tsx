import { cn } from "@/lib/ui/cn";

/** A month and day on a sand chip. */
export default function DateChip({ month, day, className }: { month: string; day: string; className?: string }) {
  return (
    <span className={cn("grid min-w-[54px] justify-items-center rounded-[14px] bg-sand p-1.5", className)}>
      <small className="font-heading text-[0.75rem]/[normal] font-semibold text-subtle">{month}</small>
      <b className="font-heading text-[1.375rem]/none font-bold">{day}</b>
    </span>
  );
}
