import { cn } from "@/lib/ui/cn";

/** A round initial for a person. `dim` greys it out for someone who is not here today. */
export default function Avatar({
  name,
  color,
  size = 40,
  dim,
  className,
}: {
  name: string;
  color: string;
  size?: number;
  dim?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-grid flex-none place-items-center rounded-[32%] font-heading text-[1em]/none font-bold text-cocoa-deep",
        className,
      )}
      style={{ width: size, height: size, background: dim ? "#e7ded2" : color, fontSize: size * 0.42 }}
    >
      {name[0]}
    </span>
  );
}
