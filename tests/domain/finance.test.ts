import { describe, expect, it } from "vitest";
import { billedAmount, openAmount, paymentBreakdown, receivedAmount } from "@/lib/domain/finance";
import type { Charge } from "@/lib/domain/types";

const charge = (id: string, amount: number, paid: number, late = false, period = "נובמבר"): Charge => ({
  id,
  childId: id,
  period,
  amount,
  paid,
  due: "",
  doc: "",
  late,
});

describe("paymentBreakdown", () => {
  const charges = [
    charge("a", 100, 100),
    charge("b", 100, 0),
    charge("c", 100, 50, true),
    charge("d", 100, 0, false, "אוקטובר"),
  ];

  it("looks only at the requested month", () => {
    expect(paymentBreakdown(charges, "נובמבר").month).toHaveLength(3);
  });

  it("splits by state", () => {
    const { paid, pending, late } = paymentBreakdown(charges, "נובמבר");
    expect(paid.map((c) => c.id)).toEqual(["a"]);
    expect(pending.map((c) => c.id)).toEqual(["b"]);
    expect(late.map((c) => c.id)).toEqual(["c"]);
  });

  it("does not call a paid charge late", () => {
    expect(paymentBreakdown([charge("a", 100, 100, true)], "נובמבר").late).toEqual([]);
  });
});

describe("amounts", () => {
  const charges = [charge("a", 100, 100), charge("b", 200, 50)];

  it("adds up what was billed, received and is still open", () => {
    expect(billedAmount(charges)).toBe(300);
    expect(receivedAmount(charges)).toBe(150);
    expect(openAmount(charges)).toBe(150);
  });
});
