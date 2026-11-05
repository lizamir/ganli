// Everything the app writes to the server. Each function returns an error message in Hebrew, or null on success.
import { todayKey } from "@/lib/domain/time";
import type { CareEvent, InquiryKind, LeadInput } from "@/lib/domain/types";
import { supabase } from "./client";
import { ilTime } from "./dates";
import { hebrewError } from "./errors";
import type { Membership } from "./memberships";

const SUPA_KIND = { meal: "meal", sleep: "sleep", care: "diaper" } as const;

/** Logs one care event. */
export async function insertEvent(m: Membership, e: Omit<CareEvent, "id">) {
  const day = todayKey();
  const { error } = await supabase!.from("care_events").insert({
    institution_id: m.institution_id,
    child_id: e.childId,
    kind: SUPA_KIND[e.kind],
    occurred_at: ilTime(day, e.start),
    ended_at: e.end ? ilTime(day, e.end) : null,
    detail: `${e.title} · ${e.detail}`,
    created_by: m.userId,
  });
  return error ? hebrewError(error.message) : null;
}

/** Records a payment against a charge. */
export async function insertPayment(m: Membership, chargeId: string, amount: number) {
  const { error } = await supabase!.from("payments").insert({
    institution_id: m.institution_id,
    charge_id: chargeId,
    amount_agorot: Math.round(amount * 100),
    method: "העברה בנקאית",
  });
  return error ? hebrewError(error.message) : null;
}

/** Sends an announcement to all parents. */
export async function insertAnnouncement(m: Membership, title: string, body: string) {
  const { error } = await supabase!
    .from("announcements")
    .insert({ institution_id: m.institution_id, title, body, created_by: m.userId });
  return error ? hebrewError(error.message) : null;
}

/** Rebuilds today's attendance and care log in a demo institution (see reset_demo_day in the DB). */
export async function resetDemoDay(m: Membership) {
  const { error } = await supabase!.rpc("reset_demo_day", { p_inst: m.institution_id });
  return error ? hebrewError(error.message) : null;
}

/** Sends a parent message or an absence report. */
export async function insertInquiry(m: Membership, input: { kind: InquiryKind; text: string; childId?: string }) {
  const { error } = await supabase!.from("inquiries").insert({
    institution_id: m.institution_id,
    child_id: input.childId ?? null,
    from_user: m.userId,
    kind: input.kind,
    body: input.text,
    day: input.kind === "absence" ? todayKey() : null,
  });
  return error ? hebrewError(error.message) : null;
}

/** Marks a parent inquiry as handled, or open again. */
export async function resolveInquiry(id: string, done: boolean) {
  const { error } = await supabase!.from("inquiries").update({ resolved: done }).eq("id", id);
  return error ? hebrewError(error.message) : null;
}

/** Marks a child as collected: attendance becomes "left" with the time. Staff and admin may write attendance. */
export async function checkOutChild(m: Membership, childId: string) {
  const day = todayKey();
  const { data, error } = await supabase!
    .from("attendance")
    .update({ status: "left", left_at: new Date().toISOString(), updated_by: m.userId })
    .eq("child_id", childId)
    .eq("day", day)
    .select("id");
  if (error) return hebrewError(error.message);
  if (!data?.length) return "לילד אין רישום נוכחות להיום";
  return null;
}

/** Public enrollment request from the marketing site (anon may insert, nobody but the admin may read). */
export async function insertLead(institutionId: string, lead: LeadInput) {
  const { error } = await supabase!.from("leads").insert({
    institution_id: institutionId,
    parent_name: lead.parent,
    phone: lead.phone,
    child_name: lead.child,
    age_group: lead.group,
    message: lead.message,
  });
  return error ? hebrewError(error.message) : null;
}
