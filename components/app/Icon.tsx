// Small line icons for the dashboards (24px grid, stroke follows currentColor).
const PATHS: Record<string, string> = {
  home: "M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 12 0v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6",
  wallet: "M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2zM16 14.5h.01",
  chat: "M4 5h16v11H9l-5 4z",
  camera: "M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  child: "M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM7 22l1-7-3-3 3-3h8l3 3-3 3 1 7",
  clipboard: "M9 4h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h4",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
  meal: "M5 3v8a3 3 0 0 0 6 0V3M8 3v18M17 3c-2 2-2 6 0 8v10",
  sleep: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",
  care: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  foot: "M8 5.5a2 2.5 0 1 0 0 .1M7 11c-2 0-3 2-3 4s2 5 4 5 3-2 3-4-2-5-4-5zM16 3.5a2 2.5 0 1 0 0 .1M17 9c-2 0-4 3-4 5s1 4 3 4 4-3 4-5-1-4-3-4z",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4",
  calendar: "M4 6h16v15H4zM4 10h16M9 3v5M15 3v5",
  check: "M5 12.5l4.5 4.5L19 7",
  star: "M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1-4.5-4.2 6.1-.8z",
  plus: "M12 5v14M5 12h14",
  warn: "M12 4l9 16H3zM12 10v4M12 17h.01",
  swap: "M7 7h13l-4-4M17 17H4l4 4",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
  menu: "M4 7h16M4 12h16M4 17h16",
  qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2M14 18h2v2h4v-4",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1",
};

export type IconName = keyof typeof PATHS;

export default function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
