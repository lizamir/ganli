"use client";

import Link from "next/link";
import { useEffect } from "react";
import Icon from "@/components/dashboard/ui/Icon";
import type { Profile } from "@/lib/domain/types";
import AccountTools from "./AccountTools";
import type { NavItem } from "./nav";
import { sheetLink } from "./navLinkClass";
import UserCard from "./UserCard";

type Props = { profile: Profile; more: NavItem[]; active: (href: string) => boolean; onClose: () => void };

/** The sheet that slides up on phones: the rest of the menu and the account tools. Escape closes it. */
export default function UserSheet({ profile, more, active, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="hidden mobile:fixed mobile:inset-0 mobile:z-[100] mobile:flex mobile:items-end mobile:bg-[rgba(62,50,43,0.45)]"
      onClick={onClose}
    >
      <div
        className="sheet mobile:grid mobile:max-h-[88svh] mobile:w-full mobile:animate-[sheet-up_0.4s_var(--ease-out)] mobile:gap-3.5 mobile:overflow-y-auto mobile:rounded-t-[28px] mobile:bg-cocoa-deep mobile:px-[18px] mobile:pt-3 mobile:pb-6 mobile:text-cream"
        role="dialog"
        aria-modal="true"
        aria-label="תפריט"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="mobile:mx-auto mobile:mt-0 mobile:mb-1.5 mobile:h-[5px] mobile:w-11 mobile:rounded-[3px] mobile:bg-[rgba(255,255,255,0.3)]"
          aria-hidden="true"
        />
        <UserCard profile={profile} />
        {more.length > 0 && (
          <nav className="mobile:grid mobile:gap-1" aria-label="עוד עמודים">
            {more.map((item) => (
              <Link key={item.href} href={`${item.href}/`} onClick={onClose} className={sheetLink(active(item.href))}>
                <Icon name={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        <AccountTools profile={profile} onDone={onClose} />
        <button
          type="button"
          className="btn btn-ghost btn-sm mobile:text-cream mobile:shadow-[inset_0_0_0_2px_var(--cream)]"
          onClick={onClose}
        >
          סגירה
        </button>
      </div>
    </div>
  );
}
