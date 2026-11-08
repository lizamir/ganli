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
    <div className="grid gap-3">
      {ROLES.map((r) => (
        <button
          type="button"
          key={r.role}
          className="role-card relative grid gap-1 rounded-[22px] bg-paper py-5 pr-6 pl-[60px] text-right shadow-block [transition:transform_0.25s_cubic-bezier(0.3,1.6,0.5,1)] hover:not-disabled:[transform:translateX(-6px)] disabled:cursor-not-allowed disabled:opacity-50"
          style={{ "--role": r.color, "--role-soft": r.soft } as React.CSSProperties}
          onClick={() => {
            signInDemo(r.role);
            router.push(`/app/${r.role}/`);
          }}
        >
          <span className="[justify-self:start] rounded-[999px] bg-[var(--role-soft)] px-3 py-1.5 font-heading text-[0.8125rem]/none font-bold text-cocoa-deep">
            {r.label}
          </span>
          <b className="mt-1.5 font-heading text-[1.3125rem]/[1.3] font-semibold text-cocoa-deep">{r.who}</b>
          <small className="text-[0.9375rem] text-subtle">{r.text}</small>
          <i
            className="absolute top-1/2 left-6 [transform:translateY(-50%)] text-[1.375rem] text-cocoa not-italic"
            aria-hidden="true"
          >
            ←
          </i>
        </button>
      ))}
    </div>
  );
}
