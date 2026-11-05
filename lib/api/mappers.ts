// Pure functions that turn database rows into the shapes the dashboards use. No network here.
import type { CareEvent, Charge, Child, Inquiry, InquiryKind, Lead } from "@/lib/domain/types";
import { TZ } from "@/lib/domain/time";
import { ddmmyyyy, hhmm, periodLabel, shortDateTime } from "./dates";

const COLORS = [
  "#f6c86e",
  "#9fd8cf",
  "#f6b4aa",
  "#d7c3a3",
  "#c9b8ec",
  "#a8d8f0",
  "#ffcf9e",
  "#c8e6a0",
  "#e9dccb",
  "#f3c6d8",
];

export type ChildRow = {
  id: string;
  full_name: string;
  birth_date: string | null;
  allergies: string;
  care_notes: string;
};
export type AttendanceRow = {
  child_id: string;
  status: Child["status"];
  arrived_at: string | null;
  left_at: string | null;
};
export type GuardianRow = { child_id: string; user_id: string; relation: string };
export type EventRow = {
  id: string;
  child_id: string;
  kind: string;
  occurred_at: string;
  ended_at: string | null;
  detail: string;
  created_by: string;
};
export type ChargeRow = {
  id: string;
  child_id: string;
  period: string;
  amount_agorot: number;
  due_date: string;
  note: string;
};
export type PaymentRow = { charge_id: string; amount_agorot: number };
export type InquiryRow = {
  id: string;
  child_id: string | null;
  from_user: string;
  kind: string;
  body: string;
  resolved: boolean;
  created_at: string;
};
export type LeadRow = {
  id: string;
  parent_name: string;
  phone: string;
  child_name: string;
  age_group: string;
  message: string;
  created_at: string;
};

/** Children with today's attendance, guardians and a stable color. */
export function mapChildren(
  rows: ChildRow[],
  attendance: AttendanceRow[],
  guardians: GuardianRow[],
  nameOf: Map<string, string>,
): Child[] {
  const att = new Map(attendance.map((a) => [a.child_id, a]));
  return rows.map((k, i) => {
    const a = att.get(k.id);
    const parents = guardians
      .filter((g) => g.child_id === k.id)
      .map((g) => nameOf.get(g.user_id) || g.relation)
      .filter(Boolean)
      .join(" ו");
    return {
      id: k.id,
      name: k.full_name,
      birth: ddmmyyyy(k.birth_date),
      parents,
      allergy: k.allergies,
      careNotes: k.care_notes,
      consentMissing: false,
      status: a?.status ?? "expected",
      arrival: hhmm(a?.arrived_at),
      pickup: hhmm(a?.left_at),
      absenceNote: a?.status === "absent" ? "ההורה דיווח היעדרות" : undefined,
      flag: k.allergies ? { tone: "bad", text: "אלרגיה" } : undefined,
      color: COLORS[i % COLORS.length],
      authorized: guardians
        .filter((g) => g.child_id === k.id)
        .map((g) => ({ name: nameOf.get(g.user_id) || g.relation || "הורה", relation: g.relation || "הורה" })),
    };
  });
}

const EVENT_KIND: Record<string, CareEvent["kind"]> = { meal: "meal", sleep: "sleep", diaper: "care", toilet: "care" };
const EVENT_TITLE: Record<string, string> = { meal: "ארוחה", sleep: "שינה", diaper: "החלפת חיתול", toilet: "שירותים" };
const MEAL_AMOUNT: [string, number][] = [
  ["הכול", 1],
  ["חצי", 0.5],
  ["חלק", 0.6],
  ["מעט", 0.25],
];

/** Care events. The detail column holds "title · detail", and a meal's amount is read from its wording. */
export function mapEvents(rows: EventRow[], nameOf: Map<string, string>): CareEvent[] {
  return rows
    .filter((e) => EVENT_KIND[e.kind])
    .map((e) => {
      const [title, detail = ""] = e.detail.split(" · ");
      return {
        id: e.id,
        childId: e.child_id,
        kind: EVENT_KIND[e.kind],
        start: hhmm(e.occurred_at)!,
        end: hhmm(e.ended_at),
        title: title || EVENT_TITLE[e.kind],
        detail,
        amount: e.kind === "meal" ? MEAL_AMOUNT.find(([w]) => detail.includes(w))?.[1] : undefined,
        by: nameOf.get(e.created_by),
      };
    });
}

/** Charges with what was paid against each. Money is stored in agorot; a charge is late two weeks after its due date. */
export function mapCharges(rows: ChargeRow[], payments: PaymentRow[], now = Date.now()): Charge[] {
  const paidBy = new Map<string, number>();
  for (const p of payments) paidBy.set(p.charge_id, (paidBy.get(p.charge_id) ?? 0) + p.amount_agorot / 100);
  const twoWeeksAgo = new Date(now - 14 * 864e5).toISOString().slice(0, 10);
  return rows.map((c) => ({
    id: c.id,
    childId: c.child_id,
    period: periodLabel(c.period),
    amount: c.amount_agorot / 100,
    paid: paidBy.get(c.id) ?? 0,
    due: ddmmyyyy(c.due_date),
    doc: c.note,
    late: c.due_date < twoWeeksAgo,
  }));
}

/** Parent inquiries, with who sent them and about which child. */
export function mapInquiries(rows: InquiryRow[], children: Child[], nameOf: Map<string, string>): Inquiry[] {
  const childName = new Map(children.map((c) => [c.id, c.name]));
  return rows.map((q) => ({
    id: q.id,
    from: `${nameOf.get(q.from_user) || "הורה"}${q.child_id && childName.get(q.child_id) ? `, הורה של ${childName.get(q.child_id)}` : ""}`,
    text: q.body,
    time: shortDateTime(q.created_at),
    done: q.resolved,
    kind: q.kind as InquiryKind,
    childId: q.child_id ?? undefined,
    childName: q.child_id ? childName.get(q.child_id) : undefined,
  }));
}

/** Enrollment requests from the marketing site. */
export const mapLeads = (rows: LeadRow[]): Lead[] =>
  rows.map((l) => ({
    id: l.id,
    parent: l.parent_name,
    phone: l.phone,
    child: l.child_name,
    group: l.age_group,
    message: l.message,
    time: shortDateTime(l.created_at),
  }));

/** Attendance per day for the weekly chart. */
export function mapAttendanceWeek(rows: { day: string; status: string }[], total: number) {
  const present = new Map<string, number>();
  for (const a of rows)
    if (a.status === "present" || a.status === "left") present.set(a.day, (present.get(a.day) ?? 0) + 1);
  return [...present.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([d, n]) => ({
      label: new Intl.DateTimeFormat("he-IL", { weekday: "short", timeZone: TZ }).format(new Date(`${d}T12:00:00Z`)),
      present: n,
      total,
    }));
}
