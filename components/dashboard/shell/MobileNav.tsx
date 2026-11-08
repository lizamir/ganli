import Link from "next/link";
import { Avatar } from "@/components/dashboard/ui";
import Icon from "@/components/dashboard/ui/Icon";
import type { Profile } from "@/lib/domain/types";
import BrandLink from "./BrandLink";
import type { NavItem } from "./nav";
import { tabLink } from "./navLinkClass";

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
      <header className="hidden mobile:sticky mobile:top-0 mobile:z-[60] mobile:flex mobile:items-center mobile:justify-between mobile:gap-3 mobile:border-b mobile:border-b-sand mobile:bg-[rgba(246,239,227,0.92)] mobile:px-4 mobile:py-2.5 mobile:backdrop-blur-[12px]">
        <BrandLink top />
        <button
          type="button"
          className="mobile:flex mobile:min-h-12 mobile:items-center mobile:gap-2.5 mobile:rounded-[999px] mobile:bg-paper mobile:py-1 mobile:pr-1 mobile:pl-3.5 mobile:font-bold mobile:shadow-[0_2px_0_rgba(62,50,43,0.1)] mobile:[border:0]"
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          onClick={onOpenSheet}
          aria-label="תפריט משתמש"
        >
          <span>{profile.name}</span>
          <Avatar name={profile.name} color="#f6c86e" size={38} />
        </button>
      </header>

      <nav
        className="m-bottom hidden mobile:fixed mobile:inset-x-0 mobile:bottom-0 mobile:z-[60] mobile:grid mobile:auto-cols-[1fr] mobile:grid-flow-col mobile:border-t mobile:border-t-sand mobile:bg-paper mobile:px-1.5 mobile:pt-1.5 mobile:pb-[calc(6px+env(safe-area-inset-bottom))] mobile:shadow-[0_-10px_30px_-18px_rgba(62,50,43,0.5)]"
        aria-label="ניווט ראשי"
      >
        {primary.map((item) => (
          <Link
            key={item.href}
            href={`${item.href}/`}
            className={tabLink(active(item.href))}
            aria-current={active(item.href) ? "page" : undefined}
          >
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </Link>
        ))}
        {hasMore && (
          <button type="button" className={tabLink(moreActive)} onClick={onOpenSheet} aria-haspopup="dialog">
            <Icon name="more" size={22} />
            <span>עוד</span>
          </button>
        )}
      </nav>
    </>
  );
}
