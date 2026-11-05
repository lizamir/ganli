import { toMinutes } from "./time";
import type { CareEvent, Child } from "./types";

/** Says a sleep length the way a person would, in Hebrew. */
const sleepLength = (mins: number) => {
  if (mins < 20) return "כמה דקות";
  if (mins < 50) return "חצי שעה";
  if (mins < 75) return "שעה";
  if (mins < 100) return "שעה ורבע";
  if (mins < 130) return "שעה וחצי";
  return "כמעט שעתיים";
};

/** Builds one warm paragraph out of the care log. It is a template over real events (no AI model):
 *  every sentence is backed by an entry the staff logged, and silence is never reported as "nothing happened". */
export function summarizeDay(child: Pick<Child, "name">, events: CareEvent[], now: string): string {
  const name = child.name;
  const meals = events.filter((e) => e.kind === "meal");
  const sleeps = events.filter((e) => e.kind === "sleep" && e.end);
  const care = events.filter((e) => e.kind === "care");
  const parts: string[] = [];

  if (meals.length) {
    const avg = meals.reduce((s, m) => s + (m.amount ?? 0.7), 0) / meals.length;
    const how = avg >= 0.85 ? "אכל/ה כמעט הכול" : avg >= 0.5 ? "אכל/ה יפה" : "אכל/ה מעט";
    parts.push(`${name} ${how} ב${meals.length === 1 ? "ארוחה אחת" : `־${meals.length} ארוחות`}`);
  }
  if (sleeps.length) {
    const total = sleeps.reduce((s, e) => s + (toMinutes(e.end!) - toMinutes(e.start)), 0);
    parts.push(`ישנ/ה ${sleepLength(total)}`);
  }
  if (care.length)
    parts.push(`${care.length === 1 ? "הייתה החלפה אחת" : `היו ${care.length} החלפות/שירותים`}, ללא הערות מיוחדות`);

  if (!parts.length) return `${name} הגיע/ה לגן. עדיין לא נרשמו עדכונים היום, והצוות יעדכן בהמשך.`;
  const last = events
    .map((e) => e.end ?? e.start)
    .sort()
    .at(-1)!;
  const stale = toMinutes(now) - toMinutes(last) > 120;
  return `${parts.join(", ")}.${stale ? " העדכון האחרון היה לפני יותר משעתיים." : " הכול כרגיל ובקצב של הילד."}`;
}
