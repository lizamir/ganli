"use client";

import { auto, useAutomations } from "@/lib/automations/store";
import { hebDate } from "@/lib/automations/schedule";
import { LinkButton } from "@/components/dashboard/ui";
import { cn } from "@/lib/ui/cn";

const noticeItem = "flex flex-wrap items-center gap-3.5 rounded-[18px] px-4 py-3";
const noticeBot = "grid size-10 flex-none place-items-center rounded-[50%] bg-white text-[1.1rem]";

/** The "bot" that tells a parent there is an urgent sign-up list waiting, with a one-tap answer. */
export default function SignupNotice({ childId, childName }: { childId: string; childName: string }) {
  const { signups } = useAutomations();
  const open = signups.filter((s) => !s.signed.includes(childId));
  const done = signups.filter((s) => s.signed.includes(childId));
  if (!signups.length) return null;
  return (
    <div className="mb-5 grid gap-2.5" role="region" aria-label="הרשמות פתוחות">
      {open.map((s) => (
        <div
          className={cn(
            noticeItem,
            "animate-[sn-in_0.5s_var(--ease-out)] bg-[#fff4dd] shadow-[inset_0_0_0_2px_var(--mustard)]",
          )}
          key={s.id}
        >
          <span className={cn(noticeBot, "animate-[sn-ring_2.4s_ease-in-out_infinite]")} aria-hidden="true">
            🔔
          </span>
          <p className="min-w-[200px] flex-1">
            <b>צריך להירשם:</b> {s.title}. ההרשמה נסגרת ב{hebDate(s.deadline)}.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => auto.sign(s.id, childId, childName, true)}
          >
            לרשום את {childName}
          </button>
        </div>
      ))}
      {done.map((s) => (
        <div className={cn(noticeItem, "bg-[#eaf5f3]")} key={s.id}>
          <span className={noticeBot} aria-hidden="true">
            ✓
          </span>
          <p className="min-w-[200px] flex-1">נרשמתם ל{s.title} ✓</p>
          <LinkButton onClick={() => auto.sign(s.id, childId, childName, false)}>ביטול הרשמה</LinkButton>
        </div>
      ))}
    </div>
  );
}
