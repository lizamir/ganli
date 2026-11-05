import { toMinutes } from "./time";
import type { CareEvent } from "./types";

/** After this long with no update, a child is flagged for the staff and the director. */
export const STALE_MINUTES = 120;

/** The time of a child's latest logged event, or undefined when nothing was logged yet. */
export const lastUpdate = (events: CareEvent[], childId: string) =>
  events
    .filter((e) => e.childId === childId)
    .map((e) => e.end ?? e.start)
    .sort()
    .at(-1);

/** Minutes between two "HH:MM" times. */
export const minutesSince = (now: string, then: string) => toMinutes(now) - toMinutes(then);
