import { describe, expect, it } from "vitest";
import { mapAttendanceWeek, mapCharges, mapChildren, mapEvents, mapInquiries } from "@/lib/api/mappers";
import type { Child } from "@/lib/domain/types";

const names = new Map([["u1", "דנה"]]);

describe("mapChildren", () => {
  const row = { id: "k1", full_name: "נועה", birth_date: "2025-02-14", allergies: "אגוזים", care_notes: "" };

  it("joins attendance and guardians", () => {
    const [child] = mapChildren(
      [row],
      [{ child_id: "k1", status: "absent", arrived_at: null, left_at: null }],
      [{ child_id: "k1", user_id: "u1", relation: "אמא" }],
      names,
    );
    expect(child.name).toBe("נועה");
    expect(child.birth).toBe("14.02.2025");
    expect(child.status).toBe("absent");
    expect(child.absenceNote).toBeTruthy();
    expect(child.authorized).toEqual([{ name: "דנה", relation: "אמא" }]);
    expect(child.flag?.tone).toBe("bad");
  });

  it("expects a child with no attendance row", () => {
    expect(mapChildren([row], [], [], names)[0].status).toBe("expected");
  });
});

describe("mapEvents", () => {
  const base = { id: "e1", child_id: "k1", occurred_at: "2026-11-05T08:00:00Z", ended_at: null, created_by: "u1" };

  it("splits the title from the detail and reads the meal amount", () => {
    const [e] = mapEvents([{ ...base, kind: "meal", detail: "ארוחת בוקר · אכל/ה חצי" }], names);
    expect(e.title).toBe("ארוחת בוקר");
    expect(e.detail).toBe("אכל/ה חצי");
    expect(e.amount).toBe(0.5);
    expect(e.by).toBe("דנה");
  });

  it("groups diaper and toilet as care, and drops unknown kinds", () => {
    const rows = [
      { ...base, kind: "diaper", detail: "" },
      { ...base, kind: "unknown", detail: "" },
    ];
    const events = mapEvents(rows, names);
    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe("care");
    expect(events[0].title).toBe("החלפת חיתול");
  });
});

describe("mapCharges", () => {
  it("converts agorot to shekels and adds up payments", () => {
    const row = {
      id: "c1",
      child_id: "k1",
      period: "2026-11",
      amount_agorot: 180000,
      due_date: "2026-11-10",
      note: "",
    };
    const pays = [
      { charge_id: "c1", amount_agorot: 50000 },
      { charge_id: "c1", amount_agorot: 30000 },
    ];
    const [c] = mapCharges([row], pays, Date.parse("2026-11-05"));
    expect(c.amount).toBe(1800);
    expect(c.paid).toBe(800);
    expect(c.late).toBe(false);
  });

  it("marks a charge late two weeks after its due date", () => {
    const row = { id: "c1", child_id: "k1", period: "2026-10", amount_agorot: 100, due_date: "2026-10-01", note: "" };
    expect(mapCharges([row], [], Date.parse("2026-11-05"))[0].late).toBe(true);
  });
});

describe("mapInquiries", () => {
  it("says who wrote, and about which child", () => {
    const child = { id: "k1", name: "נועה" } as Child;
    const row = {
      id: "q1",
      child_id: "k1",
      from_user: "u1",
      kind: "message",
      body: "שלום",
      resolved: false,
      created_at: "2026-11-05T08:00:00Z",
    };
    const [q] = mapInquiries([row], [child], names);
    expect(q.from).toBe("דנה, הורה של נועה");
    expect(q.childName).toBe("נועה");
  });
});

describe("mapAttendanceWeek", () => {
  it("counts present and collected children per day, in order", () => {
    const rows = [
      { day: "2026-11-05", status: "present" },
      { day: "2026-11-04", status: "left" },
      { day: "2026-11-05", status: "left" },
      { day: "2026-11-05", status: "absent" },
    ];
    expect(mapAttendanceWeek(rows, 10).map((d) => d.present)).toEqual([1, 2]);
  });
});
