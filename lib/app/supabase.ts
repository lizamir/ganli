import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CareEvent, Charge, Child, GanliSnapshot, InstitutionChoice, Inquiry, InquiryKind, Lead, LeadInput, Profile, Role } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Without these the app runs in demo mode on mock data. The portfolio build forces demo mode
// (NEXT_PUBLIC_GANLI_DEMO=1) so public visitors never reach the real database.
export const supabaseConfigured = Boolean(url && anonKey) && process.env.NEXT_PUBLIC_GANLI_DEMO !== "1";

export const supabase: SupabaseClient | null = supabaseConfigured ? createClient(url!, anonKey!) : null;

export function hebrewError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "דוא״ל או סיסמה שגויים";
  if (m.includes("password") && m.includes("characters")) return "הסיסמה קצרה מדי (לפחות 6 תווים)";
  if (m.includes("confirm")) return "יש לאשר את כתובת הדוא״ל דרך המייל שנשלח";
  if (m.includes("network") || m.includes("fetch")) return "אין חיבור לשרת. בדקו את החיבור ונסו שוב";
  if (m.includes("row-level security") || m.includes("permission") || m.includes("not allowed")) return "אין לך הרשאה לפעולה הזו";
  return "משהו השתבש. נסו שוב";
}

const TZ = "Asia/Jerusalem";
const hhmm = (iso: string | null | undefined) =>
  iso ? new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ }).format(new Date(iso)) : undefined;
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date()); // YYYY-MM-DD
// Israel's current UTC offset ("+03:00" in summer, "+02:00" in winter).
const ilOffset = () =>
  new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" }).formatToParts(new Date()).find((p) => p.type === "timeZoneName")?.value.replace("GMT", "") || "+02:00";
const ddmmyyyy = (d: string | null) => (d ? d.split("-").reverse().join(".") : "");
const periodLabel = (p: string) => {
  const [y, m] = p.split("-").map(Number);
  return m ? new Intl.DateTimeFormat("he-IL", { month: "long", year: "numeric" }).format(new Date(y, m - 1, 1)) : p;
};
const COLORS = ["#f6c86e", "#9fd8cf", "#f6b4aa", "#d7c3a3", "#c9b8ec", "#a8d8f0", "#ffcf9e", "#c8e6a0", "#e9dccb", "#f3c6d8"];

export type Membership = { role: Role; institution_id: string; display_name: string; userId: string };

const PICK_KEY = "ganli-institution";
export function rememberInstitution(id: string) {
  try {
    localStorage.setItem(PICK_KEY, id);
  } catch {
    // Not critical.
  }
}

/** All of the user's memberships, plus the one to open: the remembered one, else a demo, else the newest. */
export async function loadMemberships(): Promise<{ current: Membership; all: InstitutionChoice[] } | null> {
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data } = await supabase
    .from("memberships")
    .select("role, institution_id, display_name, institutions(name)")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });
  if (!data?.length) return null;

  const all: InstitutionChoice[] = data.map((m) => ({
    id: m.institution_id,
    role: m.role as Role,
    name: (m.institutions as unknown as { name: string } | null)?.name ?? "",
  }));
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(PICK_KEY);
  } catch {
    // Fall through to the default.
  }
  const pick =
    data.find((m) => m.institution_id === saved) ??
    data.find((m, i) => all[i].name.endsWith("(דמו)")) ??
    data[0];
  return { current: { role: pick.role as Role, institution_id: pick.institution_id, display_name: pick.display_name, userId: auth.user.id }, all };
}

/** Reads everything the dashboards need. RLS decides which rows come back. */
export async function loadSnapshot(m: Membership): Promise<{ snapshot: GanliSnapshot; profile: Profile }> {
  const sb = supabase!;
  const inst = m.institution_id;
  const day = today();
  const noFinance = m.role === "staff"; // RLS hides finance from staff anyway; skip the requests.
  const weekStart = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
  const [instRes, kidsRes, attRes, evRes, chargeRes, payRes, annRes, guardRes, memRes, inqRes, leadRes, weekRes] = await Promise.all([
    sb.from("institutions").select("name").eq("id", inst).single(),
    sb.from("children").select("id, full_name, birth_date, allergies, care_notes").eq("institution_id", inst).eq("archived", false).order("created_at"),
    sb.from("attendance").select("child_id, status, arrived_at, left_at").eq("institution_id", inst).eq("day", day),
    sb.from("care_events").select("id, child_id, kind, occurred_at, ended_at, detail, created_by").eq("institution_id", inst).gte("occurred_at", `${day}T00:00:00${ilOffset()}`).order("occurred_at"),
    noFinance ? Promise.resolve({ data: [] }) : sb.from("charges").select("id, child_id, period, amount_agorot, due_date, note").eq("institution_id", inst).order("period", { ascending: false }),
    noFinance ? Promise.resolve({ data: [] }) : sb.from("payments").select("charge_id, amount_agorot").eq("institution_id", inst),
    sb.from("announcements").select("id, title, body, created_at").eq("institution_id", inst).order("created_at", { ascending: false }),
    sb.from("child_guardians").select("child_id, user_id, relation"),
    sb.from("memberships").select("user_id, role, display_name").eq("institution_id", inst),
    sb.from("inquiries").select("id, child_id, from_user, kind, body, resolved, created_at").eq("institution_id", inst).order("created_at", { ascending: false }).limit(50),
    m.role === "admin"
      ? sb.from("leads").select("id, parent_name, phone, child_name, age_group, message, created_at").eq("institution_id", inst).order("created_at", { ascending: false }).limit(50)
      : Promise.resolve({ data: [] }),
    sb.from("attendance").select("day, status").eq("institution_id", inst).gte("day", weekStart),
  ]);

  // Names of other members are visible to the admin only (RLS); others see their own row.
  const nameOf = new Map((memRes.data ?? []).map((r) => [r.user_id, r.display_name]));
  const guardians = guardRes.data ?? [];
  const att = new Map((attRes.data ?? []).map((a) => [a.child_id, a]));

  const children: Child[] = (kidsRes.data ?? []).map((k, i) => {
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

  const KIND: Record<string, CareEvent["kind"]> = { meal: "meal", sleep: "sleep", diaper: "care", toilet: "care" };
  const TITLE: Record<string, string> = { meal: "ארוחה", sleep: "שינה", diaper: "החלפת חיתול", toilet: "שירותים" };
  const AMOUNT: [string, number][] = [["הכול", 1], ["חצי", 0.5], ["חלק", 0.6], ["מעט", 0.25]];
  const events: CareEvent[] = (evRes.data ?? [])
    .filter((e) => KIND[e.kind])
    .map((e) => {
      const [title, detail = ""] = e.detail.split(" · ");
      return {
        id: e.id,
        childId: e.child_id,
        kind: KIND[e.kind],
        start: hhmm(e.occurred_at)!,
        end: hhmm(e.ended_at),
        title: title || TITLE[e.kind],
        detail,
        amount: e.kind === "meal" ? AMOUNT.find(([w]) => detail.includes(w))?.[1] : undefined,
        by: nameOf.get(e.created_by),
      };
    });

  const paidBy = new Map<string, number>();
  for (const p of payRes.data ?? []) paidBy.set(p.charge_id, (paidBy.get(p.charge_id) ?? 0) + p.amount_agorot / 100);
  const twoWeeksAgo = new Date(Date.now() - 14 * 864e5).toISOString().slice(0, 10);
  const charges: Charge[] = (chargeRes.data ?? []).map((c) => ({
    id: c.id,
    childId: c.child_id,
    period: periodLabel(c.period),
    amount: c.amount_agorot / 100,
    paid: paidBy.get(c.id) ?? 0,
    due: ddmmyyyy(c.due_date),
    doc: c.note,
    late: c.due_date < twoWeeksAgo,
  }));

  const childName = new Map(children.map((c) => [c.id, c.name]));
  const fmtTime = (iso: string) =>
    new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(new Date(iso));
  const inquiries: Inquiry[] = (inqRes.data ?? []).map((q) => ({
    id: q.id,
    from: `${nameOf.get(q.from_user) || "הורה"}${q.child_id && childName.get(q.child_id) ? `, הורה של ${childName.get(q.child_id)}` : ""}`,
    text: q.body,
    time: fmtTime(q.created_at),
    done: q.resolved,
    kind: q.kind as InquiryKind,
    childId: q.child_id ?? undefined,
    childName: q.child_id ? childName.get(q.child_id) : undefined,
  }));
  const leads: Lead[] = (leadRes.data ?? []).map((l) => ({
    id: l.id, parent: l.parent_name, phone: l.phone, child: l.child_name, group: l.age_group, message: l.message, time: fmtTime(l.created_at),
  }));
  const present = new Map<string, number>();
  for (const a of weekRes.data ?? []) if (a.status === "present" || a.status === "left") present.set(a.day, (present.get(a.day) ?? 0) + 1);
  const attendanceWeek = [...present.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([d, n]) => ({ label: new Intl.DateTimeFormat("he-IL", { weekday: "short", timeZone: TZ }).format(new Date(`${d}T12:00:00Z`)), present: n, total: children.length }));

  const snapshot: GanliSnapshot = {
    institution: instRes.data?.name ?? "המשפחתון",
    currentPeriod: periodLabel(day.slice(0, 7)),
    dayLabel: new Intl.DateTimeFormat("he-IL", { weekday: "long", day: "numeric", month: "long", timeZone: TZ }).format(new Date()),
    now: hhmm(new Date().toISOString())!,
    children,
    events,
    charges,
    announcements: (annRes.data ?? []).map((a) => ({
      id: a.id,
      title: a.title,
      body: a.body,
      time: new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(new Date(a.created_at)),
      needsRead: false,
      readBy: 0,
      of: 0,
    })),
    // Not in the schema yet: shown as empty states.
    inquiries,
    photos: [],
    upcoming: [],
    staff: (memRes.data ?? [])
      .filter((r) => r.role === "staff")
      .map((r) => ({ id: r.user_id, name: r.display_name, role: "צוות", perms: ["נוכחות", "ארוחות ושינה", "טיפול"], present: true })),
    leads,
    pickups: [],
    attendanceWeek,
    alerts: children.filter((c) => c.allergy).map((c) => ({ id: `al-${c.id}`, tone: "bad" as const, lead: "אלרגיה:", text: `${c.name} · ${c.allergy}` })),
  };

  const ROLE_TITLE: Record<Role, string> = { admin: "מנהלת", staff: "צוות", parent: "הורה" };
  const myChild = guardians.find((g) => g.user_id === m.userId && children.some((c) => c.id === g.child_id));
  const profile: Profile = {
    name: m.display_name || ROLE_TITLE[m.role],
    role: m.role,
    title: `${ROLE_TITLE[m.role]} · ${snapshot.institution}`,
    childId: m.role === "parent" ? myChild?.child_id : undefined,
  };
  return { snapshot, profile };
}

const SUPA_KIND = { meal: "meal", sleep: "sleep", care: "diaper" } as const;
const ilTime = (day: string, t: string) => new Date(`${day}T${t}:00${ilOffset()}`).toISOString();

export async function insertEvent(m: Membership, e: Omit<CareEvent, "id">) {
  const day = today();
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

export async function insertPayment(m: Membership, chargeId: string, amount: number) {
  const { error } = await supabase!
    .from("payments")
    .insert({ institution_id: m.institution_id, charge_id: chargeId, amount_agorot: Math.round(amount * 100), method: "העברה בנקאית" });
  return error ? hebrewError(error.message) : null;
}

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

export async function insertInquiry(m: Membership, input: { kind: InquiryKind; text: string; childId?: string }) {
  const { error } = await supabase!.from("inquiries").insert({
    institution_id: m.institution_id,
    child_id: input.childId ?? null,
    from_user: m.userId,
    kind: input.kind,
    body: input.text,
    day: input.kind === "absence" ? today() : null,
  });
  return error ? hebrewError(error.message) : null;
}

export async function resolveInquiry(id: string, done: boolean) {
  const { error } = await supabase!.from("inquiries").update({ resolved: done }).eq("id", id);
  return error ? hebrewError(error.message) : null;
}

/** Marks a child as collected: attendance becomes "left" with the time. Staff and admin may write attendance. */
export async function checkOutChild(m: Membership, childId: string) {
  const day = today();
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
