import Link from "next/link";
import Icon from "@/components/dashboard/ui/Icon";
import type { Profile } from "@/lib/domain/types";
import AccountTools from "./AccountTools";
import BrandLink from "./BrandLink";
import type { NavItem } from "./nav";
import { sideLink } from "./navLinkClass";
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
    <aside className="side sticky top-0 flex h-screen flex-col gap-[22px] bg-cocoa-deep px-[18px] py-[26px] text-cream mobile:static mobile:hidden mobile:h-auto mobile:gap-3.5 mobile:p-4">
      <BrandLink />
      <UserCard profile={profile} />
      <nav className="grid gap-1 mobile:flex mobile:overflow-x-auto" aria-label="ניווט באזור האישי">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={`${item.href}/`}
            className={sideLink(active(item.href))}
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
