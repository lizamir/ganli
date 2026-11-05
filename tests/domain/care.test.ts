import { describe, expect, it } from "vitest";
import { lastUpdate, minutesSince } from "@/lib/domain/care";
import { toMinutes } from "@/lib/domain/time";
import type { CareEvent } from "@/lib/domain/types";

const event = (childId: string, start: string, end?: string): CareEvent => ({
  id: start,
  childId,
  kind: "meal",
  start,
  end,
  title: "",
  detail: "",
});

describe("lastUpdate", () => {
  const events = [event("k1", "09:00"), event("k1", "10:00", "10:30"), event("k2", "11:00")];

  it("takes the latest time of that child, using the end when there is one", () => {
    expect(lastUpdate(events, "k1")).toBe("10:30");
  });

  it("is undefined when nothing was logged", () => {
    expect(lastUpdate(events, "k3")).toBeUndefined();
  });
});

describe("time helpers", () => {
  it("converts HH:MM to minutes", () => {
    expect(toMinutes("01:30")).toBe(90);
  });

  it("subtracts times", () => {
    expect(minutesSince("12:00", "10:30")).toBe(90);
  });
});
