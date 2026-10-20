"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGanli } from "@/lib/app/store";
import type { Role } from "@/lib/app/types";
import { LogoMark } from "../Shapes";
import Icon, { type IconName } from "./Icon";
import { Avatar } from "./ui";

type NavItem = { href: string; label: string; icon: IconName };

const NAV: Record<Role, NavItem[]> = {
  parent: [
    { href: "/app/parent", label: "היום", icon: "home" },
    { href: "/app/parent/pickup", label: "איסוף", icon: "qr" },
    { href: "/app/parent/menu", label: "תפריט", icon: "meal" },
    { href: "/app/parent/messages", label: "הודעות", icon: "chat" },
    { href: "/app/parent/photos", label: "אלבומים", icon: "camera" },
    { href: "/app/parent/payments", label: "תשלומים", icon: "wallet" },
    { href: "/app/parent/child", label: "כרטיס ילד", icon: "child" },
  ],
  staff: [
    { href: "/app/staff", label: "הקבוצה", icon: "users" },
    { href: "/app/staff/log", label: "יומן", icon: "clipboard" },
    { href: "/app/staff/pickup", label: "איסוף", icon: "qr" },
    { href: "/app/staff/menu", label: "תפריט", icon: "meal" },
    { href: "/app/staff/info", label: "חשוב", icon: "warn" },
  ],
  admin: [
    { href: "/app/admin", label: "סקירה", icon: "home" },
    { href: "/app/admin/children", label: "ילדים", icon: "users" },
    { href: "/app/admin/finance", label: "כספים", icon: "wallet" },
    { href: "/app/admin/messages", label: "הודעות", icon: "chat" },
    { href: "/app/admin/leads", label: "הרשמות", icon: "clipboard" },
  ],
};

const ROLE_LABEL: Record<Role, string> = { parent: "הורה", staff: "צוות", admin: "מנהלת" };
const MOBILE_PRIMARY = 4; // when there are more than 5 items, the 5th slot becomes "more"

/** Live notices: a new care event for the parent's child, or a new inquiry for staff and admin. */
function useLiveToasts() {
  const { data, profile } = useGanli();
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  const seen = useRef<Set<string> | null>(null);
  const seenFor = useRef("");

  useEffect(() => {
    if (!data || !profile) return;
    const who = `${profile.role}:${profile.childId ?? ""}`;
    if (seenFor.current !== who) {
      seenFor.current = who; // a different role or child: start fresh, no stale notices
      seen.current = null;
    }
    const current = new Map<string, string>();
    if (profile.role === "parent") {
      for (const e of data.events) if (e.childId === profile.childId) current.set(`e${e.id}`, `${e.by ?? "הצוות"} עדכנה: ${e.title}`);
    } else {
      for (const q of data.inquiries) current.set(`q${q.id}`, q.kind === "absence" ? `דיווח היעדרות: ${q.childName ?? q.from}` : `פנייה חדשה: ${q.from}`);
    }
    if (seen.current === null) {
      seen.current = new Set(current.keys());
      return;
    }
    const fresh = [...current].filter(([id]) => !seen.current!.has(id));
    if (!fresh.length) return;
    fresh.forEach(([id]) => seen.current!.add(id));
    // Syncing the UI with data that changed outside React (another tab, or the server).
    setToasts((t) => [...t, ...fresh.map(([id, text]) => ({ id, text }))].slice(-3));
  }, [data, profile]);

  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => setToasts((x) => x.slice(1)), 6000);
    return () => clearTimeout(t);
  }, [toasts]);

  return toasts;
}

export default function Shell({ children }: { children: ReactNode }) {
  const { status, profile, mode, signOut, signInDemo, actions, institutions, switchInstitution } = useGanli();
  const router = useRouter();
  const path = usePathname();
  const [sheet, setSheet] = useState(false);
  const toasts = useLiveToasts();
  const role = profile?.role;
  const wrongArea = role && !path.startsWith(`/app/${role}`);

  useEffect(() => {
    if (status === "out" || status === "needsSetup") router.replace("/login/");
    else if (status === "ready" && wrongArea) router.replace(`/app/${role}/`);
  }, [status, wrongArea, role, router]);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sheet]);

  if (status !== "ready" || !profile || wrongArea) {
    return (
      <div className="app-loading" role="status">
        <LogoMark />
        <span>טוענים את המשפחתון…</span>
      </div>
    );
  }

  const nav = NAV[profile.role];
  const active = (href: string) => (href === `/app/${profile.role}` ? path.replace(/\/$/, "") === href : path.startsWith(href));
  const needMore = nav.length > 5;
  const primary = needMore ? nav.slice(0, MOBILE_PRIMARY) : nav;
  const more = needMore ? nav.slice(MOBILE_PRIMARY) : [];
  const moreActive = more.some((n) => active(n.href));

  const demoSwitch = mode === "demo" && (
    <div className="side-demo">
      <span>מצב הדגמה · החליפו תפקיד</span>
      <div>
        {(["parent", "staff", "admin"] as Role[]).map((r) => (
          <button
            type="button"
            key={r}
            className={r === profile.role ? "on" : undefined}
            aria-pressed={r === profile.role}
            onClick={() => {
              signInDemo(r);
              setSheet(false);
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

  const serverTools = mode === "supabase" && (institutions.length > 1 || actions.reset) && (
    <div className="side-demo">
      {institutions.length > 1 && (
        <label className="inst-pick">
          <span>מסגרת</span>
          <select
            value={institutions.find((i) => profile.title.endsWith(i.name))?.id}
            onChange={(e) => {
              switchInstitution(e.target.value);
              setSheet(false);
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

  const logout = (
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
  );

  return (
    <div className="app">
      {/* Desktop sidebar */}
      <aside className="side">
        <Link href="/" className="side-logo" aria-label="גנלי — לאתר">
          <LogoMark />
          <b>גנלי</b>
        </Link>
        <div className="side-user">
          <Avatar name={profile.name} color="#f6c86e" size={46} />
          <div>
            <b>{profile.name}</b>
            <span>{profile.title}</span>
          </div>
        </div>
        <nav aria-label="ניווט באזור האישי">
          {nav.map((item) => (
            <Link key={item.href} href={`${item.href}/`} className={active(item.href) ? "on" : undefined} aria-current={active(item.href) ? "page" : undefined}>
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
        {demoSwitch}
        {serverTools}
        {logout}
      </aside>

      {/* Mobile top bar + bottom tabs */}
      <header className="m-top">
        <Link href="/" className="side-logo" aria-label="גנלי — לאתר">
          <LogoMark />
          <b>גנלי</b>
        </Link>
        <button type="button" className="m-user" aria-haspopup="dialog" aria-expanded={sheet} onClick={() => setSheet(true)} aria-label="תפריט משתמש">
          <span>{profile.name}</span>
          <Avatar name={profile.name} color="#f6c86e" size={38} />
        </button>
      </header>

      <nav className="m-bottom" aria-label="ניווט ראשי">
        {primary.map((item) => (
          <Link key={item.href} href={`${item.href}/`} className={active(item.href) ? "on" : undefined} aria-current={active(item.href) ? "page" : undefined}>
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </Link>
        ))}
        {needMore && (
          <button type="button" className={moreActive ? "on" : undefined} onClick={() => setSheet(true)} aria-haspopup="dialog">
            <Icon name="more" size={22} />
            <span>עוד</span>
          </button>
        )}
      </nav>

      {sheet && (
        <div className="sheet-wrap" onClick={() => setSheet(false)}>
          <div className="sheet" role="dialog" aria-modal="true" aria-label="תפריט" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" aria-hidden="true" />
            <div className="side-user">
              <Avatar name={profile.name} color="#f6c86e" size={46} />
              <div>
                <b>{profile.name}</b>
                <span>{profile.title}</span>
              </div>
            </div>
            {more.length > 0 && (
              <nav aria-label="עוד עמודים">
                {more.map((item) => (
                  <Link key={item.href} href={`${item.href}/`} onClick={() => setSheet(false)} className={active(item.href) ? "on" : undefined}>
                    <Icon name={item.icon} />
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
            {demoSwitch}
            {serverTools}
            {logout}
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSheet(false)}>
              סגירה
            </button>
          </div>
        </div>
      )}

      <main className="app-main" id="main" tabIndex={-1}>
        {children}
      </main>

      <div className="toasts" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <Icon name="bell" size={18} /> {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
