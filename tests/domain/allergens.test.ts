import { describe, expect, it } from "vitest";
import { allergensOf } from "@/lib/domain/allergens";

describe("allergensOf", () => {
  it("finds an allergen inside free text", () => {
    expect(allergensOf("אלרגיה לאגוזים")).toEqual(["nuts"]);
  });

  it("merges words that mean the same allergen", () => {
    expect(allergensOf("בוטנים ושקדים")).toEqual(["nuts"]);
  });

  it("finds several allergens", () => {
    expect(allergensOf("חלב וביצים").sort()).toEqual(["egg", "milk"]);
  });

  it("returns nothing for empty notes", () => {
    expect(allergensOf("")).toEqual([]);
  });
});
