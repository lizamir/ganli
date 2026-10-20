"use client";

import { useSyncExternalStore } from "react";

/** Visitor accessibility preferences, saved in localStorage and mirrored to <html> classes. */
export type A11y = { size: 0 | 1 | 2 | 3; contrast: boolean; motion: boolean; links: boolean; spacing: boolean };

const KEY = "ganli-a11y";
const DEFAULT: A11y = { size: 0, contrast: false, motion: false, links: false, spacing: false };
const listeners = new Set<() => void>();
let cache: A11y | null = null;

function read(): A11y {
  if (cache) return cache;
  let stored: Partial<A11y> = {};
  try {
    stored = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    // Blocked storage: defaults.
  }
  cache = { ...DEFAULT, ...stored };
  return cache;
}

function apply(s: A11y) {
  const d = document.documentElement;
  if (s.size) d.dataset.size = String(s.size);
  else delete d.dataset.size;
  d.classList.toggle("a11y-contrast", s.contrast);
  d.classList.toggle("a11y-nomotion", s.motion);
  d.classList.toggle("a11y-links", s.links);
  d.classList.toggle("a11y-spacing", s.spacing);
}

export function setA11y(patch: Partial<A11y>) {
  cache = { ...read(), ...patch };
  apply(cache);
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Still applies for this visit.
  }
  listeners.forEach((l) => l());
}

export function resetA11y() {
  setA11y(DEFAULT);
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useA11y(): A11y {
  return useSyncExternalStore(subscribe, read, () => DEFAULT);
}

/** True when animation should be off: the OS asks for it, or the visitor turned it off here. */
export function useMotionOff(): boolean {
  const s = useA11y();
  const os = useSyncExternalStore(
    (l) => {
      const m = matchMedia("(prefers-reduced-motion: reduce)");
      m.addEventListener("change", l);
      return () => m.removeEventListener("change", l);
    },
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
  return s.motion || os;
}
