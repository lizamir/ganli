"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { NAV, CONTACT } from "@/content";
import { Logo } from "@/components/common/Shapes";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useHideOnScroll } from "@/lib/hooks/useHideOnScroll";
import { useMenuLock } from "@/lib/hooks/useMenuLock";
import { smoothScrollTo } from "@/lib/smoothScrollTo";
import { cn } from "@/lib/ui/cn";

const SECTION_IDS = NAV.map((n) => n.href.slice(1));

// The floating pill bar. On touch screens it drops the live blur (smoother scrolling over the 3D canvas).
const bar =
  "container pointer-events-auto flex items-center justify-between gap-5 rounded-[999px] [padding:10px_12px_10px_22px] [transition:background_0.4s,box-shadow_0.4s] tablet:[padding:8px_10px_8px_20px]";
const barClosed =
  "bg-[rgba(255,253,248,0.84)] shadow-[0_10px_40px_-20px_rgba(62,50,43,0.4)] [backdrop-filter:blur(16px)_saturate(1.3)] touch:bg-[rgba(255,253,248,0.97)] touch:[backdrop-filter:none]";
const barOpen = "bg-transparent [box-shadow:none] [backdrop-filter:none]";
const navLink =
  "rounded-[999px] px-4 py-2.5 text-[1rem] font-semibold [transition:background_0.2s,color_0.2s] hover:bg-sand aria-[current=true]:bg-cocoa-deep aria-[current=true]:text-cream";
const burgerLine =
  "block h-[2.5px] w-[22px] rounded-[2px] bg-cream [transition:transform_0.35s_var(--ease-out),opacity_0.2s]";

// The phone menu opens as a circle growing from the burger; the links rise in one after another.
const menuPanel =
  "pointer-events-auto fixed inset-0 z-[-1] flex flex-col justify-between overflow-y-auto bg-cocoa-deep [padding:118px_28px_30px] text-cream";
const menuClosed =
  "invisible [clip-path:circle(0_at_calc(100%_-_48px)_44px)] [transition:clip-path_0.7s_var(--ease-out),visibility_0s_0.7s]";
const menuOpen =
  "visible [clip-path:circle(150vmax_at_calc(100%_-_48px)_44px)] [transition:clip-path_0.8s_var(--ease-out),visibility_0s]";
const menuItemClosed =
  "opacity-0 [transform:translateY(24px)] [transition:opacity_0.5s,transform_0.6s_var(--ease-out)]";
// The delay sits inside the shorthand: a separate transition-delay utility would be reset by it.
const menuItemOpen =
  "opacity-100 [transform:none] [transition:opacity_0.5s_calc(var(--i)*70ms+250ms),transform_0.6s_var(--ease-out)_calc(var(--i)*70ms+250ms)]";
const menuLink =
  "flex items-baseline gap-4 border-b border-b-[rgba(255,255,255,0.12)] py-3 [font:900_clamp(2.2rem,10vw,3.4rem)/1_var(--font-display)] tracking-[-0.04em]";

/** The marketing site header: logo, menu with the current section, and the phone menu. */
export default function Header() {
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  const hidden = useHideOnScroll();
  const active = useActiveSection(SECTION_IDS);
  useMenuLock(open, setOpen, menu, burger);

  const onNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!open) return; // desktop: Lenis handles the anchor
    e.preventDefault();
    setOpen(false);
    setTimeout(() => smoothScrollTo(href), 60);
  };

  return (
    <header
      className={cn(
        "pointer-events-none fixed [inset:14px_0_auto] z-80 [transition:transform_0.5s_var(--ease-out)]",
        hidden && !open && "[transform:translateY(-140%)]",
      )}
    >
      <div className={cn(bar, open ? barOpen : barClosed)}>
        <Logo light={open} />
        <nav className="flex gap-[2px] tablet:hidden" aria-label="ניווט ראשי">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={navLink}
              aria-current={active === item.href.slice(1) ? "true" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex gap-2.5 tablet:hidden">
          <Link className="btn btn-ghost btn-sm px-5 py-[14px] text-[1rem]" href="/login/">
            כניסה
          </Link>
          <a className="btn btn-primary btn-sm" href="#contact">
            תיאום סיור
          </a>
        </div>
        <button
          ref={burger}
          type="button"
          className="hidden h-12 w-12 place-content-center gap-[5px] rounded-[50%] bg-cocoa-deep p-0 [border:0] tablet:grid"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "סגירת התפריט" : "פתיחת התפריט"}
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden="true" className={cn(burgerLine, open && "[transform:translateY(7.5px)_rotate(45deg)]")} />
          <span aria-hidden="true" className={cn(burgerLine, open && "opacity-0")} />
          <span
            aria-hidden="true"
            className={cn(burgerLine, open && "[transform:translateY(-7.5px)_rotate(-45deg)]")}
          />
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={menu}
        className={cn(menuPanel, open ? menuOpen : menuClosed)}
        inert={!open}
        aria-hidden={!open}
      >
        <nav aria-label="ניווט מובייל">
          <ol className="grid list-none gap-1 p-0">
            {NAV.map((item, i) => (
              <li key={item.href} style={{ ["--i" as string]: i }} className={open ? menuItemOpen : menuItemClosed}>
                <a href={item.href} onClick={(e) => onNav(e, item.href)} className={menuLink}>
                  <span className="serif text-[1.1rem] tracking-[0] text-mustard">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-[30px] grid gap-3">
          <a className="btn btn-primary" href="#contact" onClick={(e) => onNav(e, "#contact")}>
            תיאום סיור בגן
          </a>
          <Link className="btn btn-light" href="/login/">
            כניסה לאזור האישי
          </Link>
          <a className="p-3 text-center font-bold text-mustard-soft" href={CONTACT.phoneHref}>
            <bdi>{CONTACT.phone}</bdi>
          </a>
        </div>
      </div>
    </header>
  );
}
