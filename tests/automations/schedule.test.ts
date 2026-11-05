import { describe, expect, it } from "vitest";
import { freeSlots, hebDate, iso, nextWorkday } from "@/lib/automations/schedule";

// 2026-11-05 is a Thursday.
const THURSDAY = new Date(2026, 10, 5);

describe("nextWorkday", () => {
  it("skips Friday and Saturday", () => {
    expect(iso(nextWorkday(THURSDAY, 1))).toBe("2026-11-08");
  });
});

describe("hebDate", () => {
  it("writes the day in Hebrew", () => {
    expect(hebDate("2026-11-08")).toBe("יום ראשון, 8.11");
  });
});

describe("freeSlots", () => {
  it("offers three times a day", () => {
    expect(freeSlots([], 2, THURSDAY)[0].times).toEqual(["08:30", "12:45", "16:45"]);
  });

  it("removes a booked time", () => {
    const booking = { id: "b", name: "", phone: "", date: "2026-11-08", time: "08:30", topic: "", created: "" };
    expect(freeSlots([booking], 1, THURSDAY)[0].times).toEqual(["12:45", "16:45"]);
  });

  it("drops a day that is fully booked", () => {
    const bookings = ["08:30", "12:45", "16:45"].map((time) => ({
      id: time,
      name: "",
      phone: "",
      date: "2026-11-08",
      time,
      topic: "",
      created: "",
    }));
    expect(freeSlots(bookings, 1, THURSDAY)).toEqual([]);
  });
});
