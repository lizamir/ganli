"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NAV, CONTACT } from "@/lib/content";
import { Logo } from "./Shapes";

function goTo(hash: string) {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.start();
    lenis.scrollTo(hash, { offset: -96 });
  } else {
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  }
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const burger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  // Hide on scroll down, show on scroll up (more room on phones).
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 240);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section being read.
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Mobile menu: lock scroll, Escape closes, focus moves in and returns.
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    menu.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burger.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
    };
  }, [open]);

  const onNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!open) return; // desktop: Lenis handles the anchor
    e.preventDefault();
    setOpen(false);
    setTimeout(() => goTo(href), 60);
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
