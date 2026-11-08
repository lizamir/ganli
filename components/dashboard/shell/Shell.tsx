"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { LogoMark } from "@/components/common/Shapes";
import { useGanli } from "@/lib/data/GanliProvider";
import MobileNav from "./MobileNav";
import { MOBILE_PRIMARY, NAV } from "./nav";
import Sidebar from "./Sidebar";
import Toasts from "./Toasts";
import { useLiveToasts } from "./useLiveToasts";
import UserSheet from "./UserSheet";

/** The frame of the personal area. It sends visitors to the right place by sign-in state and role. */
export default function Shell({ children }: { children: ReactNode }) {
  const { status, profile } = useGanli();
  const router = useRouter();
  const path = usePathname();
  const [sheet, setSheet] = useState(false);
  const closeSheet = useCallback(() => setSheet(false), []);
  const toasts = useLiveToasts();
  const role = profile?.role;
  const wrongArea = role && !path.startsWith(`/app/${role}`);

  useEffect(() => {
    if (status === "out" || status === "needsSetup") router.replace("/login/");
    else if (status === "ready" && wrongArea) router.replace(`/app/${role}/`);
  }, [status, wrongArea, role, router]);

  if (status !== "ready" || !profile || wrongArea) {
    return (
      <div
        className="grid min-h-screen place-content-center justify-items-center gap-4 font-heading text-[1.125rem]/[normal] font-medium [&>svg]:w-[90px] [&>svg]:animate-[bob_1.4s_ease-in-out_infinite]"
        role="status"
      >
        <LogoMark />
        <span>טוענים את המשפחתון…</span>
      </div>
    );
  }

  const nav = NAV[profile.role];
  const active = (href: string) =>
    href === `/app/${profile.role}` ? path.replace(/\/$/, "") === href : path.startsWith(href);
  const needMore = nav.length > 5;
  const primary = needMore ? nav.slice(0, MOBILE_PRIMARY) : nav;
  const more = needMore ? nav.slice(MOBILE_PRIMARY) : [];

  return (
    <div className="grid min-h-screen grid-cols-[272px_1fr] bg-app mobile:grid-cols-[1fr]">
      <Sidebar profile={profile} nav={nav} active={active} />
      <MobileNav
        profile={profile}
        primary={primary}
        hasMore={needMore}
        moreActive={more.some((n) => active(n.href))}
        sheetOpen={sheet}
        active={active}
        onOpenSheet={() => setSheet(true)}
      />

      {sheet && <UserSheet profile={profile} more={more} active={active} onClose={closeSheet} />}

      <main
        className="min-w-0 px-10 pt-[34px] pb-[60px] mobile:px-4 mobile:pt-5 mobile:pb-[110px]"
        id="main"
        tabIndex={-1}
      >
        {children}
      </main>

      <Toasts toasts={toasts} />
    </div>
  );
}
