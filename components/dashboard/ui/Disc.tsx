import Icon, { type IconName } from "./Icon";

/** An icon on a colored circle. */
export default function Disc({ icon, color, size = 38 }: { icon: IconName; color: string; size?: number }) {
  return (
    <span className="disc" style={{ width: size, height: size, background: color }}>
      <Icon name={icon} size={size * 0.5} />
    </span>
  );
}
