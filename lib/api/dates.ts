import { TZ } from "@/lib/domain/time";

/** The time part of a server timestamp in Israel, as HH:MM. */
export const hhmm = (iso: string | null | undefined) =>
  iso
    ? new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ }).format(
        new Date(iso),
      )
    : undefined;

/** Israel's current UTC offset ("+03:00" in summer, "+02:00" in winter). */
export const ilOffset = () =>
  new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" })
    .formatToParts(new Date())
    .find((p) => p.type === "timeZoneName")
    ?.value.replace("GMT", "") || "+02:00";

/** 2026-11-05 becomes 05.11.2026. */
export const ddmmyyyy = (d: string | null) => (d ? d.split("-").reverse().join(".") : "");

/** A month like 2026-11 becomes "נובמבר 2026". */
export const periodLabel = (p: string) => {
  const [y, m] = p.split("-").map(Number);
  return m ? new Intl.DateTimeFormat("he-IL", { month: "long", year: "numeric" }).format(new Date(y, m - 1, 1)) : p;
};

/** Short date and time, for messages. */
export const shortDateTime = (iso: string) =>
  new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  }).format(new Date(iso));

/** A time today in Israel, as a server timestamp. */
export const ilTime = (day: string, t: string) => new Date(`${day}T${t}:00${ilOffset()}`).toISOString();
