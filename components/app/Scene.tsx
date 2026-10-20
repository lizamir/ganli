import type { Photo } from "@/lib/app/types";

// Flat illustrations standing in for daycare photos (the demo has no real images).
export default function Scene({ name, label }: { name: Photo["scene"] | "party"; label?: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="scene" role="img" aria-label={label}>
      {name === "sand" && (
        <>
          <rect width="400" height="300" fill="#bfe3e0" />
          <circle cx="320" cy="70" r="38" fill="#f6c86e" />
          <path d="M0 210c80-30 160-30 240-10s120 10 160 0v100H0z" fill="#e8d3ad" />
          <rect x="70" y="170" width="54" height="40" rx="8" fill="#eb5a3b" />
          <path d="M120 180l40-40" stroke="#5b4a40" strokeWidth="8" strokeLinecap="round" />
          <circle cx="250" cy="215" r="22" fill="#2e9ea0" />
        </>
      )}
      {name === "paint" && (
        <>
          <rect width="400" height="300" fill="#fbe9c8" />
          <path d="M40 220a160 160 0 0 1 320 0" fill="none" stroke="#eb5a3b" strokeWidth="22" />
          <path d="M70 220a130 130 0 0 1 260 0" fill="none" stroke="#eaa23a" strokeWidth="22" />
          <path d="M100 220a100 100 0 0 1 200 0" fill="none" stroke="#2e9ea0" strokeWidth="22" />
          <path d="M130 220a70 70 0 0 1 140 0" fill="none" stroke="#6b5fb5" strokeWidth="22" />
          <rect x="0" y="230" width="400" height="70" fill="#d9c3a3" />
        </>
      )}
      {name === "blocks" && (
        <>
          <rect width="400" height="300" fill="#f3e7d3" />
          <rect x="110" y="190" width="70" height="70" rx="10" fill="#d9c3a3" />
          <rect x="190" y="190" width="70" height="70" rx="10" fill="#5b4a40" />
          <rect x="150" y="120" width="70" height="70" rx="10" fill="#2e9ea0" />
          <path d="M150 120l35-50 35 50z" fill="#f3a59b" />
          <rect x="270" y="215" width="45" height="45" rx="8" fill="#eaa23a" />
          <rect x="0" y="260" width="400" height="40" fill="#e8d3ad" />
        </>
      )}
      {name === "garden" && (
        <>
          <rect width="400" height="300" fill="#cfe9f5" />
          <circle cx="80" cy="70" r="34" fill="#f6c86e" />
          <path d="M0 230c100-40 200-40 400-10v80H0z" fill="#9fcf8f" />
          <rect x="250" y="120" width="16" height="120" fill="#5b4a40" />
          <circle cx="258" cy="110" r="52" fill="#6fb37a" />
          <circle cx="140" cy="230" r="10" fill="#eb5a3b" />
          <circle cx="175" cy="238" r="10" fill="#f3a59b" />
        </>
      )}
      {name === "party" && (
        <>
          <rect width="400" height="300" fill="#fde6e1" />
          {Array.from({ length: 18 }).map((_, i) => (
            <rect
              key={i}
              x={(i * 53) % 400}
              y={(i * 37) % 160}
              width="10"
              height="18"
              rx="3"
              fill={["#eb5a3b", "#eaa23a", "#2e9ea0", "#6b5fb5"][i % 4]}
              transform={`rotate(${i * 23} ${(i * 53) % 400} ${(i * 37) % 160})`}
            />
          ))}
          <rect x="140" y="170" width="120" height="70" rx="12" fill="#f3a59b" />
          <rect x="140" y="170" width="120" height="18" rx="9" fill="#fffdf8" />
          <rect x="196" y="140" width="8" height="30" rx="3" fill="#2e9ea0" />
          <path d="M200 124c-6 8-6 12 0 16 6-4 6-8 0-16z" fill="#eaa23a" />
          <rect x="0" y="240" width="400" height="60" fill="#d9c3a3" />
        </>
      )}
    </svg>
  );
}
