"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Lenis from "lenis";
import { useMotionOff } from "@/lib/a11y";

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

/** Inertial smooth scrolling for the marketing site only. Off for the dashboards,
 *  and off whenever the visitor prefers reduced motion. */
export default function SmoothScroll() {
  const path = usePathname();
  const motionOff = useMotionOff();
  const enabled = !motionOff && !path.startsWith("/app") && !path.startsWith("/login");

  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true, anchors: { offset: -96 } });
    window.__lenis = lenis;
    let frame = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      window.__lenis = null;
    };
  }, [enabled]);

  return null;
}
