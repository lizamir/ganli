import Link from "next/link";
import Icon from "@/components/dashboard/ui/Icon";
import type { Profile } from "@/lib/domain/types";
import AccountTools from "./AccountTools";
import BrandLink from "./BrandLink";
import type { NavItem } from "./nav";
import UserCard from "./UserCard";

/** The desktop sidebar. */
export default function Sidebar({
  profile,
  nav,
  active,
}: {
  profile: Profile;
  nav: NavItem[];
  active: (href: string) => boolean;
}) {
  return (
    <aside className="side">
      <BrandLink />
      <UserCard profile={profile} />
      <nav aria-label="ניווט באזור האישי">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={`${item.href}/`}
            className={active(item.href) ? "on" : undefined}
            aria-current={active(item.href) ? "page" : undefined}
          >
            <Icon name={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>
      <AccountTools profile={profile} />
    </aside>
  );
}
