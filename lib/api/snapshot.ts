import { TZ, todayKey } from "@/lib/domain/time";
import type { GanliSnapshot, Profile, Role } from "@/lib/domain/types";
import { supabase } from "./client";
import { hhmm, ilOffset, periodLabel, shortDateTime } from "./dates";
import {
  mapAttendanceWeek,
  mapCharges,
  mapChildren,
  mapEvents,
  mapInquiries,
  mapLeads,
  type AttendanceRow,
  type ChargeRow,
  type ChildRow,
  type EventRow,
  type GuardianRow,
  type InquiryRow,
  type LeadRow,
  type PaymentRow,
} from "./mappers";
import type { Membership } from "./memberships";

const ROLE_TITLE: Record<Role, string> = { admin: "מנהלת", staff: "צוות", parent: "הורה" };

/** Reads every table the dashboards need. RLS decides which rows come back. */
async function fetchTables(m: Membership) {
  const sb = supabase!;
  const inst = m.institution_id;
  const day = todayKey();
  const noFinance = m.role === "staff"; // RLS hides finance from staff anyway; skip the requests.
  const weekStart = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
  const [
    institution,
    kids,
    attendance,
    events,
    charges,
    payments,
    announcements,
    guardians,
    members,
    inquiries,
    leads,
    week,
  ] = await Promise.all([
    sb.from("institutions").select("name").eq("id", inst).single(),
    sb
      .from("children")
      .select("id, full_name, birth_date, allergies, care_notes")
      .eq("institution_id", inst)
      .eq("archived", false)
      .order("created_at"),
    sb.from("attendance").select("child_id, status, arrived_at, left_at").eq("institution_id", inst).eq("day", day),
    sb
      .from("care_events")
      .select("id, child_id, kind, occurred_at, ended_at, detail, created_by")
      .eq("institution_id", inst)
      .gte("occurred_at", `${day}T00:00:00${ilOffset()}`)
      .order("occurred_at"),
    noFinance
      ? Promise.resolve({ data: [] })
      : sb
          .from("charges")
          .select("id, child_id, period, amount_agorot, due_date, note")
          .eq("institution_id", inst)
          .order("period", { ascending: false }),
    noFinance
      ? Promise.resolve({ data: [] })
      : sb.from("payments").select("charge_id, amount_agorot").eq("institution_id", inst),
    sb
      .from("announcements")
      .select("id, title, body, created_at")
      .eq("institution_id", inst)
      .order("created_at", { ascending: false }),
    sb.from("child_guardians").select("child_id, user_id, relation"),
    sb.from("memberships").select("user_id, role, display_name").eq("institution_id", inst),
    sb
      .from("inquiries")
      .select("id, child_id, from_user, kind, body, resolved, created_at")
      .eq("institution_id", inst)
      .order("created_at", { ascending: false })
      .limit(50),
    m.role === "admin"
      ? sb
          .from("leads")
          .select("id, parent_name, phone, child_name, age_group, message, created_at")
          .eq("institution_id", inst)
          .order("created_at", { ascending: false })
          .limit(50)
      : Promise.resolve({ data: [] }),
    sb.from("attendance").select("day, status").eq("institution_id", inst).gte("day", weekStart),
  ]);
  return {
    institution,
    kids,
    attendance,
    events,
    charges,
    payments,
    announcements,
    guardians,
    members,
    inquiries,
    leads,
    week,
    day,
  };
}

/** Loads the signed-in user's profile and everything their dashboard shows. */
export async function loadSnapshot(m: Membership): Promise<{ snapshot: GanliSnapshot; profile: Profile }> {
  const t = await fetchTables(m);
  // Names of other members are visible to the admin only (RLS); others see their own row.
  const nameOf = new Map((t.members.data ?? []).map((r) => [r.user_id, r.display_name]));
  const guardians = (t.guardians.data ?? []) as GuardianRow[];
  const children = mapChildren(
    (t.kids.data ?? []) as ChildRow[],
    (t.attendance.data ?? []) as AttendanceRow[],
    guardians,
    nameOf,
  );

  const snapshot: GanliSnapshot = {
    institution: t.institution.data?.name ?? "המשפחתון",
    currentPeriod: periodLabel(t.day.slice(0, 7)),
    dayLabel: new Intl.DateTimeFormat("he-IL", { weekday: "long", day: "numeric", month: "long", timeZone: TZ }).format(
      new Date(),
    ),
    now: hhmm(new Date().toISOString())!,
    children,
    events: mapEvents((t.events.data ?? []) as EventRow[], nameOf),
    charges: mapCharges((t.charges.data ?? []) as ChargeRow[], (t.payments.data ?? []) as PaymentRow[]),
    announcements: (t.announcements.data ?? []).map((a) => ({
      id: a.id,
      title: a.title,
      body: a.body,
      time: shortDateTime(a.created_at),
      needsRead: false,
      readBy: 0,
      of: 0,
    })),
    inquiries: mapInquiries((t.inquiries.data ?? []) as InquiryRow[], children, nameOf),
    // Not in the schema yet: shown as empty states.
    photos: [],
    upcoming: [],
    staff: (t.members.data ?? [])
      .filter((r) => r.role === "staff")
      .map((r) => ({
        id: r.user_id,
        name: r.display_name,
        role: "צוות",
        perms: ["נוכחות", "ארוחות ושינה", "טיפול"],
        present: true,
      })),
    leads: mapLeads((t.leads.data ?? []) as LeadRow[]),
    pickups: [],
    attendanceWeek: mapAttendanceWeek(t.week.data ?? [], children.length),
    alerts: children
      .filter((c) => c.allergy)
      .map((c) => ({ id: `al-${c.id}`, tone: "bad" as const, lead: "אלרגיה:", text: `${c.name} · ${c.allergy}` })),
  };

  const myChild = guardians.find((g) => g.user_id === m.userId && children.some((c) => c.id === g.child_id));
  const profile: Profile = {
    name: m.display_name || ROLE_TITLE[m.role],
    role: m.role,
    title: `${ROLE_TITLE[m.role]} · ${snapshot.institution}`,
    childId: m.role === "parent" ? myChild?.child_id : undefined,
  };
  return { snapshot, profile };
}
