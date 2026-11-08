import { cn } from "@/lib/ui/cn";
import Icon, { type IconName } from "./Icon";

/** An icon on a colored circle. */
export default function Disc({
  icon,
  color,
  size = 38,
  className,
}: {
  icon: IconName;
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-grid flex-none place-items-center rounded-[30%]", className)}
      style={{ width: size, height: size, background: color }}
    >
      <Icon name={icon} size={size * 0.5} />
    </span>
  );
}
