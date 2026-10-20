// Shapes shared by the mock store and the Supabase adapter.
// They follow the tables in beyachad-daycare/supabase/migrations/20261009000000_core.sql.

export type Role = "parent" | "staff" | "admin";

export type CareKind = "meal" | "sleep" | "care";
export type Tone = "ok" | "warn" | "bad" | "cool" | "pink" | "mute";

export type CareEvent = {
  id: string;
  childId: string;
  kind: CareKind;
  start: string; // HH:MM
  end?: string; // no end = a single moment (e.g. a diaper change)
  title: string;
  detail: string;
  amount?: number; // meals: how much was eaten, 0..1
  by?: string;
};

export type Child = {
  id: string;
  name: string;
  birth: string;
  parents: string;
  allergy: string;
  careNotes: string;
  consentMissing: boolean;
  status: "present" | "absent" | "expected" | "left";
  arrival?: string;
  pickup?: string;
  absenceNote?: string;
  flag?: { tone: Tone; text: string };
  color: string;
  /** People allowed to collect the child (from child_guardians, plus extras). */
  authorized: { name: string; relation: string }[];
};

export type Charge = {
  id: string;
  childId: string;
  period: string;
  amount: number; // shekels
  paid: number;
  due: string;
  doc: string;
  late: boolean; // more than two weeks past due (only matters while unpaid)
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  time: string;
  needsRead: boolean;
  readBy: number;
  of: number;
};

export type InquiryKind = "message" | "absence";
export type Inquiry = { id: string; from: string; text: string; time: string; done: boolean; kind: InquiryKind; childId?: string; childName?: string };

/** A planned pickup: who is collecting a child today and about when. */
export type PlannedPickup = { childId: string; who: string; time: string };

export type Rsvp = "yes" | "no";

export type Photo = { id: string; scene: "sand" | "paint" | "blocks" | "garden"; caption: string; time: string; tags: string[] };

export type UpcomingEvent = {
  id: string; month: string; day: string; title: string; sub: string; tag: string; tone: Tone;
  rsvp?: { going: number; notGoing: number; of: number; mine?: Rsvp }; // present when the event asks parents to answer
};

export type Staff = { id: string; name: string; role: string; perms: string[]; present: boolean };

export type Profile = { name: string; role: Role; childId?: string; title: string };

export type LeadInput = { parent: string; phone: string; child: string; group: string; message: string };
export type Lead = LeadInput & { id: string; time: string };

/** Everything the dashboards read. */
export type GanliSnapshot = {
  institution: string;
  currentPeriod: string; // e.g. "אוקטובר 2026"
  dayLabel: string;
  now: string;
  children: Child[];
  events: CareEvent[];
  charges: Charge[];
  announcements: Announcement[];
  inquiries: Inquiry[];
  photos: Photo[];
  upcoming: UpcomingEvent[];
  staff: Staff[];
  alerts: { id: string; tone: Tone; lead: string; text: string }[];
  leads: Lead[];
  pickups: PlannedPickup[];
  attendanceWeek: { label: string; present: number; total: number }[];
};

/** Everything the dashboards can change. */
export type GanliActions = {
  addEvent: (e: Omit<CareEvent, "id">) => Promise<string | null>;
  recordPayment: (chargeId: string, amount: number) => Promise<string | null>;
  addAnnouncement: (title: string, body: string) => Promise<string | null>;
  setInquiryDone: (id: string, done: boolean) => Promise<string | null>;
  markRead: (id: string) => Promise<string | null>;
  sendInquiry: (input: { kind: InquiryKind; text: string; childId?: string }) => Promise<string | null>;
  checkOut: (childId: string, who: string) => Promise<string | null>;
  planPickup: (childId: string, who: string, time: string) => Promise<string | null>;
  setRsvp: (eventId: string, answer: Rsvp) => Promise<string | null>;
  reset?: () => void | Promise<void>;
};

export type InstitutionChoice = { id: string; name: string; role: Role };
