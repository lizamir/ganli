import { describe, expect, it } from "vitest";
import { summarizeDay } from "@/lib/domain/daySummary";
import type { CareEvent } from "@/lib/domain/types";

const event = (over: Partial<CareEvent>): CareEvent => ({
  id: "e",
  childId: "k1",
  kind: "meal",
  start: "10:00",
  title: "",
  detail: "",
  ...over,
});

describe("summarizeDay", () => {
  it("never reports silence as nothing happened", () => {
    expect(summarizeDay({ name: "נועה" }, [], "12:00")).toContain("עדיין לא נרשמו עדכונים");
  });

  it("describes how much the child ate", () => {
    expect(summarizeDay({ name: "נועה" }, [event({ amount: 1 })], "10:30")).toContain("אכל/ה כמעט הכול");
    expect(summarizeDay({ name: "נועה" }, [event({ amount: 0.25 })], "10:30")).toContain("אכל/ה מעט");
  });

  it("adds up sleep", () => {
    const sleep = event({ kind: "sleep", start: "12:00", end: "13:00" });
    expect(summarizeDay({ name: "נועה" }, [sleep], "13:10")).toContain("ישנ/ה שעה");
  });

  it("says when the last update is old", () => {
    expect(summarizeDay({ name: "נועה" }, [event({ start: "09:00" })], "12:00")).toContain("לפני יותר משעתיים");
  });
});
