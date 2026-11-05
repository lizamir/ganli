import { describe, expect, it } from "vitest";
import { hebrewError } from "@/lib/api/errors";

describe("hebrewError", () => {
  it("translates known server errors", () => {
    expect(hebrewError("Invalid login credentials")).toBe("דוא״ל או סיסמה שגויים");
    expect(hebrewError("new row violates row-level security policy")).toBe("אין לך הרשאה לפעולה הזו");
    expect(hebrewError("Failed to fetch")).toBe("אין חיבור לשרת. בדקו את החיבור ונסו שוב");
  });

  it("falls back to a general message", () => {
    expect(hebrewError("something odd")).toBe("משהו השתבש. נסו שוב");
  });
});
