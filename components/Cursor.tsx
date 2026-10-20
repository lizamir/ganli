"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMotionOff } from "@/lib/a11y";

/** A soft ring that trails the mouse and grows over links, buttons and the 3D scene.
 *  Decoration only: the real cursor is never hidden. Mouse devices, marketing pages, motion on. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const motionOff = useMotionOff();
  const on = !motionOff && !path.startsWith("/app") && !path.startsWith("/login");

  useEffect(() => {
    const el = ref.current;
    if (!on || !el || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = -100, y = -100, tx = -100, ty = -100, frame = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.classList.add("show");
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, summary, [data-cursor]");
      el.dataset.mode = t?.dataset.cursor ? "label" : t ? "link" : "";
      el.dataset.label = t?.dataset.cursor ?? "";
    };
    const leave = () => el.classList.remove("show");
    const tick = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [on]);

  if (!on) return null;
  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span />
    </div>
  );
}
