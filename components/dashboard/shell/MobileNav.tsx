import Link from "next/link";
import { Avatar } from "@/components/dashboard/ui";
import Icon from "@/components/dashboard/ui/Icon";
import type { Profile } from "@/lib/domain/types";
import BrandLink from "./BrandLink";
import type { NavItem } from "./nav";

type Props = {
  profile: Profile;
  primary: NavItem[];
  hasMore: boolean;
  moreActive: boolean;
  sheetOpen: boolean;
  active: (href: string) => boolean;
  onOpenSheet: () => void;
};

/** The phone's top bar and bottom tabs. */
export default function MobileNav({ profile, primary, hasMore, moreActive, sheetOpen, active, onOpenSheet }: Props) {
  return (
    <>
      <header className="m-top">
        <BrandLink />
        <button
          type="button"
          className="m-user"
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          onClick={onOpenSheet}
          aria-label="תפריט משתמש"
        >
          <span>{profile.name}</span>
          <Avatar name={profile.name} color="#f6c86e" size={38} />
        </button>
      </header>

      <nav className="m-bottom" aria-label="ניווט ראשי">
        {primary.map((item) => (
          <Link
            key={item.href}
            href={`${item.href}/`}
            className={active(item.href) ? "on" : undefined}
            aria-current={active(item.href) ? "page" : undefined}
          >
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </Link>
        ))}
        {hasMore && (
          <button type="button" className={moreActive ? "on" : undefined} onClick={onOpenSheet} aria-haspopup="dialog">
            <Icon name="more" size={22} />
            <span>עוד</span>
          </button>
        )}
      </nav>
    </>
  );
}
