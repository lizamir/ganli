// Flat block shapes from the brand: square, arch, triangle, half-circle and star.

type ShapeProps = { color?: string; className?: string };

export function Square({ color = "var(--accent)", className }: ShapeProps) {
  return (
    <svg viewBox="0 0 52 52" className={className} aria-hidden="true">
      <rect x="4" y="4" width="44" height="44" rx="10" fill={color} />
      <path d="M12 18c10 4 20 4 28 0M12 32c10 5 20 5 28 0" stroke="#fff" strokeOpacity=".45" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Arch({ color = "var(--accent)", className }: ShapeProps) {
  return (
    <svg viewBox="0 0 52 52" className={className} aria-hidden="true">
      <path d="M4 48V12a8 8 0 0 1 8-8h28a8 8 0 0 1 8 8v36H36V36a10 10 0 0 0-20 0v12z" fill={color} />
    </svg>
  );
}

export function Triangle({ color = "var(--accent)", className }: ShapeProps) {
  return (
    <svg viewBox="0 0 52 52" className={className} aria-hidden="true">
      <path d="M22.5 7.5a4 4 0 0 1 7 0l19 34a4 4 0 0 1-3.5 6H7a4 4 0 0 1-3.5-6z" fill={color} />
    </svg>
  );
}

export function Half({ color = "var(--accent)", className }: ShapeProps) {
  return (
    <svg viewBox="0 0 52 52" className={className} aria-hidden="true">
      <path d="M4 40a22 22 0 0 1 44 0 4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill={color} />
    </svg>
  );
}

export function Star({ color = "var(--accent)", className }: ShapeProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2.5l2.7 6 6.5.6-4.9 4.3 1.5 6.4L12 16.5l-5.8 3.3 1.5-6.4L2.8 9.1l6.5-.6z"
        fill={color}
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export const SHAPES = { square: Square, arch: Arch, triangle: Triangle, half: Half } as const;

/** The brand mark: a little castle of blocks. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 56" className={className} aria-hidden="true">
      <path d="M44 4l7 10H37z" fill="var(--blush)" />
      <rect x="38" y="14" width="12" height="11" rx="2.5" fill="var(--wood)" />
      <path d="M20 25a6 6 0 0 1 12 0z" fill="var(--mustard)" />
      <rect x="10" y="25" width="44" height="6" rx="2" fill="var(--wood)" />
      <path d="M17 31h30v24h-9V46a6 6 0 0 0-12 0v9h-9z" fill="var(--wood-dark)" />
      <path d="M2 38l10-10v10z" fill="var(--teal)" />
      <rect x="2" y="39" width="10" height="16" rx="2.5" fill="var(--cocoa)" />
      <path d="M52 31l10 9H52z" fill="var(--tomato)" />
      <rect x="52" y="41" width="10" height="14" rx="2.5" fill="var(--cocoa)" />
    </svg>
  );
}

export function Logo() {
  return (
    <a className="logo" href="#top" aria-label="גנלי — לראש העמוד">
      <LogoMark />
      <span className="logo-word">
        <b>גנלי</b>
        <small>
          {"PLAY&LEARN".split("").map((ch, i) => (
            <span key={i}>{ch}</span>
          ))}
        </small>
      </span>
    </a>
  );
}
