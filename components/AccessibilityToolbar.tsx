"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { resetA11y, setA11y, useA11y } from "@/lib/a11y";

/** Accessibility menu (Israeli sites usually ship one): text size, contrast, motion, links, spacing. */
export default function AccessibilityToolbar() {
  const s = useA11y();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="a11y">
      <button
        ref={button}
        type="button"
        className="a11y-fab"
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="תפריט נגישות"
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="4.5" r="1.8" />
          <path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5l-3.5 6M12 14.5l3.5 6" />
        </svg>
      </button>

      {open && (
        <div id="a11y-panel" ref={panel} className="a11y-panel" role="region" aria-label="הגדרות נגישות">
          <div className="a11y-head">
            <b>נגישות</b>
            <button type="button" onClick={() => setOpen(false)} aria-label="סגירת התפריט">
              ✕
            </button>
          </div>

          <div className="a11y-size" role="group" aria-label="גודל טקסט">
            <button type="button" onClick={() => setA11y({ size: Math.max(0, s.size - 1) as 0 | 1 | 2 | 3 })} disabled={s.size === 0} aria-label="הקטנת טקסט">
              א−
            </button>
            <span aria-live="polite">{["רגיל", "גדול", "גדול מאוד", "ענק"][s.size]}</span>
            <button type="button" onClick={() => setA11y({ size: Math.min(3, s.size + 1) as 0 | 1 | 2 | 3 })} disabled={s.size === 3} aria-label="הגדלת טקסט">
              א+
            </button>
          </div>

          {(
            [
              ["contrast", "ניגודיות גבוהה"],
              ["motion", "עצירת אנימציות וגלילה חלקה"],
              ["links", "הדגשת קישורים"],
              ["spacing", "ריווח שורות ואותיות"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="a11y-toggle">
              <input type="checkbox" checked={s[key]} onChange={(e) => setA11y({ [key]: e.target.checked })} />
              <span>{label}</span>
            </label>
          ))}

          <div className="a11y-foot">
            <button type="button" onClick={resetA11y}>
              איפוס
            </button>
            <Link href="/accessibility/" onClick={() => setOpen(false)}>
              הצהרת נגישות
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
