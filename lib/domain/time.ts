export const TZ = "Asia/Jerusalem";

/** Today's date in Israel, as YYYY-MM-DD. */
export const todayKey = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());

/** Turns "HH:MM" into minutes since midnight, so times can be compared and subtracted. */
export const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
