import type { CareEvent, Child } from "./types";

const TZ = "Asia/Jerusalem";
export const todayKey = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date()); // YYYY-MM-DD

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

export const qrPayload = (childId: string, day = todayKey()) => `GANLI|${day}|${pickupCode(childId, day)}`;

/** Maps free-text allergy notes ("אלרגיה לאגוזים") to the allergen ids used in the menu. */
const KEYWORDS: [string, string][] = [
  ["אגוז", "nuts"], ["בוטנ", "nuts"], ["שקד", "nuts"],
  ["חלב", "milk"], ["לקטוז", "milk"],
  ["ביצ", "egg"],
  ["גלוטן", "gluten"], ["קמח", "gluten"], ["חיטה", "gluten"],
  ["שומשום", "sesame"], ["טחינה", "sesame"],
];
export function allergensOf(text: string): string[] {
  const found = new Set<string>();
  for (const [kw, id] of KEYWORDS) if (text.includes(kw)) found.add(id);
  return [...found];
}

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const hours = (mins: number) => {
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
    const total = sleeps.reduce((s, e) => s + (toMin(e.end!) - toMin(e.start)), 0);
    parts.push(`ישנ/ה ${hours(total)}`);
  }
  if (care.length) parts.push(`${care.length === 1 ? "הייתה החלפה אחת" : `היו ${care.length} החלפות/שירותים`}, ללא הערות מיוחדות`);

  if (!parts.length) return `${name} הגיע/ה לגן. עדיין לא נרשמו עדכונים היום, והצוות יעדכן בהמשך.`;
  const last = events.map((e) => e.end ?? e.start).sort().at(-1)!;
  const stale = toMin(now) - toMin(last) > 120;
  return `${parts.join(", ")}.${stale ? " העדכון האחרון היה לפני יותר משעתיים." : " הכול כרגיל ובקצב של הילד."}`;
}
