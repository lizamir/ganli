"use client";

import Link from "next/link";
import { useEffect } from "react";
import Icon from "@/components/dashboard/ui/Icon";
import type { Profile } from "@/lib/domain/types";
import AccountTools from "./AccountTools";
import type { NavItem } from "./nav";
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
    <div className="sheet-wrap" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label="תפריט" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" aria-hidden="true" />
        <UserCard profile={profile} />
        {more.length > 0 && (
          <nav aria-label="עוד עמודים">
            {more.map((item) => (
              <Link
                key={item.href}
                href={`${item.href}/`}
                onClick={onClose}
                className={active(item.href) ? "on" : undefined}
              >
                <Icon name={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        <AccountTools profile={profile} onDone={onClose} />
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
          סגירה
        </button>
      </div>
    </div>
  );
}
