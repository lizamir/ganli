import { todayKey } from "./time";

/** A 6-digit pickup code that is stable for one child on one day. It is the same on the parent's
 *  phone and on the staff side, so staff can check it without any extra table. (A real rollout
 *  should sign this on the server; this is the demo-grade version.) */
export function pickupCode(childId: string, day = todayKey()): string {
  let h = 2166136261;
  for (const ch of `${childId}|${day}|ganli`) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return String(Math.abs(h) % 1_000_000).padStart(6, "0");
}

/** What the pickup QR code contains. */
export const qrPayload = (childId: string, day = todayKey()) => `GANLI|${day}|${pickupCode(childId, day)}`;

/** How an authorized person is shown and stored: "דנה (אמא)". */
export const authorizedLabel = (a: { name: string; relation: string }) => `${a.name} (${a.relation})`;
