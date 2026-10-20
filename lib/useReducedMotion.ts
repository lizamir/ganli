import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** True when the OS asks for reduced motion. Always false during server rendering. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(QUERY).matches,
    () => false
  );
}
