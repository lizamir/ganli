"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Reports how far the user has scrolled through a tall section (0 at its top, 1 when its end meets the
 *  viewport bottom). Stored in a ref and sent to `onChange`, so scrolling never re-renders React. */
export function useScrollProgress<T extends HTMLElement>(
  target: RefObject<T | null>,
  onChange?: (p: number, el: T) => void,
  enabled = true
) {
  const progress = useRef(0);
  const cb = useRef(onChange);
  useEffect(() => {
    cb.current = onChange;
  });

  useEffect(() => {
    const el = target.current;
    if (!el || !enabled) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      const p = range > 0 ? Math.min(Math.max(-r.top / range, 0), 1) : 0;
      progress.current = p;
      cb.current?.(p, el);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [target, enabled]);

  return progress;
}

/** True while the element is on screen (used to pause WebGL when it is not). */
export function useOnScreen<T extends HTMLElement>(target: RefObject<T | null>, margin = "200px") {
  const visible = useRef(false);
  const listeners = useRef(new Set<(v: boolean) => void>());
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        listeners.current.forEach((l) => l(e.isIntersecting));
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, margin]);
  return { visible, listeners };
}
