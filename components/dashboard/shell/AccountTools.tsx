"use client";

import { useRouter } from "next/navigation";
import Icon from "@/components/dashboard/ui/Icon";
import { useGanli } from "@/lib/data/GanliProvider";
import type { Profile, Role } from "@/lib/domain/types";
import { ROLE_LABEL } from "./nav";

/** Demo mode: switch between the three roles, or reset the demo data. */
function DemoSwitch({ role, onDone }: { role: Role; onDone: () => void }) {
  const { signInDemo, actions } = useGanli();
  const router = useRouter();
  return (
    <div className="side-demo">
      <span>מצב הדגמה · החליפו תפקיד</span>
      <div>
        {(["parent", "staff", "admin"] as Role[]).map((r) => (
          <button
            type="button"
            key={r}
            className={r === role ? "on" : undefined}
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
      <button type="button" className="side-reset" onClick={() => actions.reset?.()}>
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
    <div className="side-demo">
      {institutions.length > 1 && (
        <label className="inst-pick">
          <span>מסגרת</span>
          <select
            value={institutions.find((i) => profile.title.endsWith(i.name))?.id}
            onChange={(e) => {
              switchInstitution(e.target.value);
              onDone();
              router.replace("/app/");
            }}
          >
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} · {ROLE_LABEL[i.role]}
              </option>
            ))}
          </select>
        </label>
      )}
      {actions.reset && (
        <button type="button" className="side-reset" onClick={() => actions.reset?.()}>
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
        className="side-out"
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
