/** A small bar chart of how many children came each day this week. Pure SVG, with a text table fallback for screen readers. */
export default function AttendanceChart({ week }: { week: { label: string; present: number; total: number }[] }) {
  if (!week.length) return <p className="empty">עדיין אין נתוני נוכחות להצגה.</p>;
  const max = Math.max(...week.map((w) => w.total), 1);
  const W = 360;
  const H = 150;
  const bw = Math.min(44, (W - 20) / week.length - 12);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H + 30}`} className="att-chart" role="img" aria-label={`נוכחות השבוע: ${week.map((w) => `${w.label} ${w.present} מתוך ${w.total}`).join(", ")}`}>
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1="0" x2={W} y1={H - H * g} y2={H - H * g} stroke="var(--sand)" strokeDasharray="3 5" />
        ))}
        {week.map((w, i) => {
          const x = 10 + i * ((W - 20) / week.length) + ((W - 20) / week.length - bw) / 2;
          const h = (w.present / max) * H;
          const full = w.present === w.total;
          return (
            <g key={w.label + i}>
              <rect x={x} y={H - (w.total / max) * H} width={bw} height={(w.total / max) * H} rx="10" fill="var(--sand)" />
              <rect x={x} y={H - h} width={bw} height={h} rx="10" fill={full ? "var(--teal)" : "var(--mustard)"} />
              <text x={x + bw / 2} y={H - h - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--cocoa-deep)">
                {w.present}
              </text>
              <text x={x + bw / 2} y={H + 20} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--muted)">
                {w.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
