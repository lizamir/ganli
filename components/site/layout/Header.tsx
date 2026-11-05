"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { NAV, CONTACT } from "@/content";
import { Logo } from "@/components/common/Shapes";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useHideOnScroll } from "@/lib/hooks/useHideOnScroll";
import { useMenuLock } from "@/lib/hooks/useMenuLock";
import { smoothScrollTo } from "@/lib/smoothScrollTo";

const SECTION_IDS = NAV.map((n) => n.href.slice(1));

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
    <header className={`header${hidden && !open ? " is-hidden" : ""}${open ? " is-open" : ""}`}>
      <div className="container header-inner">
        <Logo />
        <nav className="nav-desktop" aria-label="ניווט ראשי">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} aria-current={active === item.href.slice(1) ? "true" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="btn btn-ghost btn-sm" href="/login/">
            כניסה
          </Link>
          <a className="btn btn-primary btn-sm" href="#contact">
            תיאום סיור
          </a>
        </div>
        <button
          ref={burger}
          type="button"
          className="burger"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "סגירת התפריט" : "פתיחת התפריט"}
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <div id="mobile-menu" ref={menu} className="mobile-menu" inert={!open} aria-hidden={!open}>
        <nav aria-label="ניווט מובייל">
          <ol>
            {NAV.map((item, i) => (
              <li key={item.href} style={{ ["--i" as string]: i }}>
                <a href={item.href} onClick={(e) => onNav(e, item.href)}>
                  <span className="serif">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mobile-menu-cta">
          <a className="btn btn-primary" href="#contact" onClick={(e) => onNav(e, "#contact")}>
            תיאום סיור בגן
          </a>
          <Link className="btn btn-light" href="/login/">
            כניסה לאזור האישי
          </Link>
          <a className="mobile-phone" href={CONTACT.phoneHref}>
            <bdi>{CONTACT.phone}</bdi>
          </a>
        </div>
      </div>
    </header>
  );
}
