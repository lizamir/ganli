import { useEffect, type RefObject } from "react";

/** While the mobile menu is open: locks page scrolling, moves focus into the menu, and Escape closes it. */
export function useMenuLock(
  open: boolean,
  setOpen: (open: boolean) => void,
  menu: RefObject<HTMLElement | null>,
  trigger: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    menu.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
    };
  }, [open, setOpen, menu, trigger]);
}
