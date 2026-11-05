import type { Charge } from "./types";

/** Splits one month's charges by state: paid in full, waiting, or late. */
export function paymentBreakdown(charges: Charge[], period: string) {
  const month = charges.filter((c) => c.period === period);
  const paid = month.filter((c) => c.paid >= c.amount);
  const late = month.filter((c) => c.paid < c.amount && c.late);
  const pending = month.filter((c) => c.paid < c.amount && !late.includes(c));
  return { month, paid, late, pending };
}

/** What is still owed across a list of charges. */
export const openAmount = (charges: Charge[]) => charges.reduce((s, c) => s + c.amount - c.paid, 0);

/** The full amount billed across a list of charges. */
export const billedAmount = (charges: Charge[]) => charges.reduce((s, c) => s + c.amount, 0);

/** What was received across a list of charges. */
export const receivedAmount = (charges: Charge[]) => charges.reduce((s, c) => s + c.paid, 0);
