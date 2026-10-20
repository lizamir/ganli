"use client";

import { useEffect } from "react";

/** One observer for the whole page. When an element scrolls into view it gets a data attribute:
 *  `[data-in]` becomes `data-in="on"` (its masked lines slide in) and `.reveal` gets `data-visible`.
 *  Attributes, not classes, on purpose: React rewrites `className` on re-render and would wipe a class
 *  added from outside (that made an open FAQ item vanish), but it never touches attributes it does not own. */
export default function Reveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.hasAttribute("data-in")) el.setAttribute("data-in", "on");
          if (el.classList.contains("reveal")) el.setAttribute("data-visible", "");
          io.unobserve(el);
        }),
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".reveal, [data-in]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
