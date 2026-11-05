import { describe, expect, it } from "vitest";
import { authorizedLabel, pickupCode, qrPayload } from "@/lib/domain/pickup";

describe("pickupCode", () => {
  it("is six digits", () => {
    expect(pickupCode("k1", "2026-11-05")).toMatch(/^\d{6}$/);
  });

  it("stays the same for the same child and day", () => {
    expect(pickupCode("k1", "2026-11-05")).toBe(pickupCode("k1", "2026-11-05"));
  });

  it("changes with the day and with the child", () => {
    expect(pickupCode("k1", "2026-11-05")).not.toBe(pickupCode("k1", "2026-11-06"));
    expect(pickupCode("k1", "2026-11-05")).not.toBe(pickupCode("k2", "2026-11-05"));
  });
});

describe("qrPayload", () => {
  it("carries the day and the code", () => {
    expect(qrPayload("k1", "2026-11-05")).toBe(`GANLI|2026-11-05|${pickupCode("k1", "2026-11-05")}`);
  });
});

describe("authorizedLabel", () => {
  it("shows the name with the relation", () => {
    expect(authorizedLabel({ name: "דנה", relation: "אמא" })).toBe("דנה (אמא)");
  });
});
