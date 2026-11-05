/** A round initial for a person. `dim` greys it out for someone who is not here today. */
export default function Avatar({
  name,
  color,
  size = 40,
  dim,
}: {
  name: string;
  color: string;
  size?: number;
  dim?: boolean;
}) {
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: dim ? "#e7ded2" : color, fontSize: size * 0.42 }}
    >
      {name[0]}
    </span>
  );
}
