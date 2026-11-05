"use client";

import { useRouter } from "next/navigation";
import { useGanli } from "@/lib/data/GanliProvider";
import type { Role } from "@/lib/domain/types";

const ROLES: { role: Role; label: string; who: string; text: string; color: string; soft: string }[] = [
  {
    role: "parent",
    label: "הורה",
    who: "דנה, אמא של נועה",
    text: "היום של הילד, תמונות, הודעות ותשלומים",
    color: "var(--blush)",
    soft: "var(--blush-soft)",
  },
  {
    role: "staff",
    label: "צוות",
    who: "מירב, מטפלת",
    text: "נוכחות, ארוחות, שינה ועדכון קבוצתי",
    color: "var(--teal)",
    soft: "var(--teal-soft)",
  },
  {
    role: "admin",
    label: "מנהלת",
    who: "אורית, מנהלת",
    text: "סקירת המשפחתון, ילדים, כספים והודעות",
    color: "var(--mustard)",
    soft: "var(--mustard-soft)",
  },
];

/** Demo sign in: pick a role and enter with no password. */
export default function DemoRoleCards() {
  const { signInDemo } = useGanli();
  const router = useRouter();
  return (
    <div className="role-cards">
      {ROLES.map((r) => (
        <button
          type="button"
          key={r.role}
          className="role-card"
          style={{ "--role": r.color, "--role-soft": r.soft } as React.CSSProperties}
          onClick={() => {
            signInDemo(r.role);
            router.push(`/app/${r.role}/`);
          }}
        >
          <span className="role-chip">{r.label}</span>
          <b>{r.who}</b>
          <small>{r.text}</small>
          <i aria-hidden="true">←</i>
        </button>
      ))}
    </div>
  );
}
