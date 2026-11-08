"use client";

import { useRouter } from "next/navigation";
import Icon from "@/components/dashboard/ui/Icon";
import { useGanli } from "@/lib/data/GanliProvider";
import type { Profile, Role } from "@/lib/domain/types";
import { cn } from "@/lib/ui/cn";
import { ROLE_LABEL } from "./nav";

const toolButton =
  "flex items-center gap-2 p-1 font-heading text-[0.875rem]/[normal] font-medium text-side-muted [background:none] [border:0] hover:text-white";

/** Demo mode: switch between the three roles, or reset the demo data. */
function DemoSwitch({ role, onDone }: { role: Role; onDone: () => void }) {
  const { signInDemo, actions } = useGanli();
  const router = useRouter();
  return (
    <div className="mt-auto grid gap-2.5 rounded-[18px] bg-[rgba(255,255,255,0.06)] p-3.5 text-[0.8125rem] text-side-muted">
      <span className="mobile:hidden">מצב הדגמה · החליפו תפקיד</span>
      <div className="flex gap-1.5">
        {(["parent", "staff", "admin"] as Role[]).map((r) => (
          <button
            type="button"
            key={r}
            className={cn(
              "flex-1 rounded-[10px] px-1 py-[9px] font-heading text-[0.875rem]/[normal] font-semibold [border:0]",
              r === role ? "bg-teal-deep text-white" : "bg-[rgba(255,255,255,0.1)] text-cream",
            )}
            aria-pressed={r === role}
            onClick={() => {
              signInDemo(r);
              onDone();
              router.push(`/app/${r}/`);
            }}
          >
            {ROLE_LABEL[r]}
          </button>
        ))}
      </div>
      <button type="button" className={toolButton} onClick={() => actions.reset?.()}>
        <Icon name="refresh" size={15} /> איפוס נתוני הדמו
      </button>
    </div>
  );
}

/** Connected mode: switch institution, and rebuild the day in a demo institution. */
function ServerTools({ profile, onDone }: { profile: Profile; onDone: () => void }) {
  const { actions, institutions, switchInstitution } = useGanli();
  const router = useRouter();
  if (!(institutions.length > 1 || actions.reset)) return null;
  return (
    <div className="mt-auto grid gap-2.5 rounded-[18px] bg-[rgba(255,255,255,0.06)] p-3.5 text-[0.8125rem] text-side-muted">
      {institutions.length > 1 && (
        <label className="grid gap-1.5">
          <span className="mobile:hidden">מסגרת</span>
          <select
            className="rounded-[10px] bg-[rgba(255,255,255,0.1)] px-2.5 py-[9px] font-heading text-[0.875rem]/[normal] font-medium text-cream [border:0]"
            value={institutions.find((i) => profile.title.endsWith(i.name))?.id}
            onChange={(e) => {
              switchInstitution(e.target.value);
              onDone();
              router.replace("/app/");
            }}
          >
            {institutions.map((i) => (
              <option key={i.id} value={i.id} className="text-cocoa-deep">
                {i.name} · {ROLE_LABEL[i.role]}
              </option>
            ))}
          </select>
        </label>
      )}
      {actions.reset && (
        <button type="button" className={toolButton} onClick={() => actions.reset?.()}>
          <Icon name="refresh" size={15} /> יצירת יום דמו מחדש
        </button>
      )}
    </div>
  );
}

/** Role or institution tools (by mode) and the sign-out button. Used in the sidebar and in the phone sheet. */
export default function AccountTools({ profile, onDone = () => {} }: { profile: Profile; onDone?: () => void }) {
  const { mode, signOut } = useGanli();
  const router = useRouter();
  return (
    <>
      {mode === "demo" && <DemoSwitch role={profile.role} onDone={onDone} />}
      {mode === "supabase" && <ServerTools profile={profile} onDone={onDone} />}
      <button
        type="button"
        className={cn(toolButton, "px-3.5 py-2.5 text-[1rem]/[normal]")}
        onClick={async () => {
          await signOut();
          router.replace("/login/");
        }}
      >
        <Icon name="logout" /> התנתקות
      </button>
    </>
  );
}
