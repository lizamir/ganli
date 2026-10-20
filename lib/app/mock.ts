// Fictional demo data, ported from beyachad-daycare/mobile/src/data/demo.ts.
// Never put details of real children here.
import type { GanliSnapshot, Profile, Role } from "./types";

const COLORS = ["#f6c86e", "#9fd8cf", "#f6b4aa", "#d7c3a3", "#c9b8ec", "#a8d8f0", "#ffcf9e", "#c8e6a0", "#e9dccb", "#f3c6d8"];

const KIDS: [string, string, string, string][] = [
  // name, birth, parents, allergy
  ["נועה", "14.02.2025", "דנה ואיל", ""],
  ["יובל", "03.06.2024", "מיכל ואיל", "אגוזים"],
  ["מיה", "22.11.2024", "ענת ויואב", ""],
  ["איתי", "09.01.2025", "שרון", ""],
  ["אורי", "30.07.2024", "נוי ואסף", ""],
  ["תמר", "18.03.2025", "רונית ודן", ""],
  ["אדם", "05.05.2024", "הילה ועמית", ""],
  ["ליה", "27.09.2024", "גל ומאיה", ""],
  ["שירה", "11.12.2024", "טל ויובל", ""],
  ["דניאל", "02.04.2025", "עדי", ""],
];

const ARRIVALS = ["08:10", "08:30", "07:55", "09:10", "08:00", "08:45", "08:20", "08:35"];

export const DEMO_PROFILES: Record<Role, Profile> = {
  parent: { name: "דנה", role: "parent", childId: "k1", title: "אמא של נועה" },
  staff: { name: "מירב", role: "staff", title: "מטפלת · הקבוצה שלי" },
  admin: { name: "אורית", role: "admin", title: "מנהלת המשפחתון" },
};

export function createDemoSnapshot(): GanliSnapshot {
  const children = KIDS.map(([name, birth, parents, allergy], i) => ({
    id: `k${i + 1}`,
    name,
    birth,
    parents,
    allergy,
    careNotes:
      name === "נועה"
        ? "ללא דבש. בקבוק לפני שנת הצהריים. מתעוררת בעדינות, אוהבת שמיכה קטנה."
        : name === "איתי"
          ? "אוהב שיר הרדמה, צריך חיבוק בהתעוררות."
          : name === "מיה"
            ? "היום תיאסף על ידי סבתא רחל."
            : name === "יובל"
              ? "ללא אגוזים בכל הארוחות, כולל ארוחת ארבע."
              : "",
    consentMissing: name === "איתי" || name === "דניאל",
    status: (i < 8 ? "present" : "absent") as "present" | "absent",
    arrival: ARRIVALS[i],
    pickup: name === "נועה" ? "16:00" : "16:30",
    absenceNote: i >= 8 ? "ההורה דיווח היעדרות" : undefined,
    flag:
      name === "נועה"
        ? { tone: "pink" as const, text: "יום הולדת" }
        : name === "יובל"
          ? { tone: "bad" as const, text: "אלרגיה" }
          : name === "מיה"
            ? { tone: "warn" as const, text: "שינוי באיסוף" }
            : undefined,
    color: COLORS[i],
    authorized:
      name === "נועה"
        ? [{ name: "דנה", relation: "אמא" }, { name: "איל", relation: "אבא" }, { name: "רחל", relation: "סבתא" }]
        : name === "מיה"
          ? [{ name: "ענת", relation: "אמא" }, { name: "יואב", relation: "אבא" }, { name: "רחל", relation: "סבתא" }]
          : parents.split(" ו").map((n, k) => ({ name: n, relation: k ? "אבא" : "אמא" })),
  }));

  type Ev = [string, "meal" | "sleep" | "care", string, string | undefined, string, string, number?];
  const ev: Ev[] = [
    ["k1", "meal", "09:00", "09:25", "ארוחת בוקר", "אכלה כמעט הכול", 0.9],
    ["k1", "care", "10:30", undefined, "החלפת חיתול", "ללא הערות"],
    ["k1", "meal", "11:50", "12:10", "ארוחת צהריים", "אכלה חצי מהמנה", 0.5],
    ["k1", "sleep", "12:15", "13:30", "שנת צהריים", "שעה ורבע"],
    ["k2", "meal", "09:05", "09:30", "ארוחת בוקר", "אכל הכול", 1],
    ["k2", "care", "11:00", undefined, "החלפת חיתול", "ללא הערות"],
    ["k2", "meal", "11:50", "12:10", "ארוחת צהריים", "אכל חלק", 0.6],
    ["k2", "sleep", "12:20", "13:40", "שנת צהריים", "שעה ועשרים"],
    ["k2", "care", "13:45", undefined, "החלפת חיתול", "ללא הערות"],
    ["k3", "meal", "09:00", "09:20", "ארוחת בוקר", "אכלה מעט", 0.3],
    ["k3", "care", "10:15", undefined, "החלפת חיתול", "ללא הערות"],
    ["k3", "sleep", "12:10", "13:15", "שנת צהריים", "שעה"],
    ["k4", "meal", "09:30", "09:50", "ארוחת בוקר", "אכל חצי", 0.5],
    ["k5", "meal", "09:00", "09:20", "ארוחת בוקר", "אכל הכול", 1],
    ["k5", "care", "10:20", undefined, "שירותים", "הצליח לבד!"],
    ["k5", "meal", "11:55", "12:15", "ארוחת צהריים", "אכל כמעט הכול", 0.9],
    ["k5", "sleep", "12:30", "14:00", "שנת צהריים", "שעה וחצי"],
    ["k6", "meal", "09:10", "09:35", "ארוחת בוקר", "אכלה הכול", 1],
    ["k6", "care", "10:40", undefined, "שירותים", "ללא הערות"],
    ["k6", "meal", "11:50", "12:05", "ארוחת צהריים", "אכלה חצי", 0.5],
    ["k6", "sleep", "12:15", "13:20", "שנת צהריים", "שעה"],
    ["k6", "care", "13:30", undefined, "שירותים", "ללא הערות"],
    ["k7", "meal", "09:00", "09:15", "ארוחת בוקר", "אכל מעט", 0.3],
    ["k7", "care", "10:50", undefined, "החלפת חיתול", "ללא הערות"],
    ["k7", "sleep", "12:20", "13:25", "שנת צהריים", "שעה"],
    ["k8", "meal", "09:05", "09:30", "ארוחת בוקר", "אכלה הכול", 1],
    ["k8", "care", "10:25", undefined, "החלפת חיתול", "ללא הערות"],
    ["k8", "meal", "11:50", "12:10", "ארוחת צהריים", "אכלה כמעט הכול", 0.9],
    ["k8", "sleep", "12:15", "13:35", "שנת צהריים", "שעה ועשרים"],
    ["k8", "care", "13:50", undefined, "החלפת חיתול", "ללא הערות"],
  ];
  const events = ev.map(([childId, kind, start, end, title, detail, amount], i) => ({
    id: `e${i + 1}`,
    childId,
    kind,
    start,
    end,
    title,
    detail,
    amount,
    by: i % 2 ? "יעל" : "מירב",
  }));

  const unpaid = new Set(["k1", "k4", "k6", "k9"]);
  const charges = children.flatMap((c) => [
    { id: `c-${c.id}-10`, childId: c.id, period: "אוקטובר 2026", amount: 1800, paid: unpaid.has(c.id) ? 0 : 1800, due: c.id === "k4" ? "01.10.2026" : "10.10.2026", doc: unpaid.has(c.id) ? "" : `חשבונית ${2050 + Number(c.id.slice(1))}`, late: c.id === "k4" },
    { id: `c-${c.id}-09`, childId: c.id, period: "ספטמבר 2026", amount: 1800, paid: 1800, due: "10.09.2026", doc: `חשבונית ${2030 + Number(c.id.slice(1))}`, late: false },
    { id: `c-${c.id}-08`, childId: c.id, period: "אוגוסט 2026", amount: 1800, paid: 1800, due: "10.08.2026", doc: `חשבונית ${2010 + Number(c.id.slice(1))}`, late: false },
  ]);

  return {
    institution: "משפחתון גנלי",
    currentPeriod: "אוקטובר 2026",
    dayLabel: "יום שלישי, 13 באוקטובר",
    now: "14:40",
    children,
    events,
    charges,
    announcements: [
      { id: "n1", title: "מחר להביא בגדים להחלפה", body: "נא להביא סט בגדים נוסף בתיק, בגלל פעילות המים.", time: "היום 10:12", needsRead: true, readBy: 6, of: 9 },
      { id: "n2", title: "המשפחתון סגור ב־20 באוקטובר", body: "חג. נחזור לפעילות רגילה למחרת.", time: "אתמול", needsRead: false, readBy: 9, of: 9 },
      { id: "n3", title: "מסיבת חנוכה", body: "ב־14 בדצמבר בשעה 14:00. נשמח לראות את כולם.", time: "לפני 3 ימים", needsRead: true, readBy: 8, of: 9 },
    ],
    inquiries: [
      { id: "q1", from: "דנה, אמא של נועה", text: "האם נועה אכלה היום ארוחת צהריים?", time: "13:40", done: false, kind: "message", childId: "k1", childName: "נועה" },
      { id: "q2", from: "איל, אבא של יובל", text: "אאחר באיסוף בעשרים דקות.", time: "12:05", done: true, kind: "message", childId: "k2", childName: "יובל" },
      { id: "q3", from: "רונית, אמא של תמר", text: "אפשר להקדים את האיסוף מחר ל־15:30?", time: "11:30", done: false, kind: "message", childId: "k6", childName: "תמר" },
      { id: "q4", from: "גל, אבא של ליה", text: "שכחנו כובע בבוקר, אפשר להשאיר בגן?", time: "09:50", done: false, kind: "message", childId: "k8", childName: "ליה" },
      { id: "q5", from: "טל, אמא של שירה", text: "שירה חולה היום ולא תגיע.", time: "07:40", done: true, kind: "absence", childId: "k9", childName: "שירה" },
    ],
    photos: [
      { id: "p1", scene: "sand", caption: "ארגז חול", time: "13:52", tags: ["נועה", "אורי"] },
      { id: "p2", scene: "paint", caption: "ציור קשת", time: "11:20", tags: ["נועה", "מיה", "תמר"] },
      { id: "p3", scene: "blocks", caption: "מגדל קוביות", time: "10:05", tags: ["יובל"] },
      { id: "p4", scene: "garden", caption: "משחק בחוץ", time: "09:40", tags: ["אדם", "ליה"] },
      { id: "p5", scene: "paint", caption: "פעילות יצירה", time: "09:15", tags: [] },
      { id: "p6", scene: "blocks", caption: "ארוחת בוקר", time: "09:00", tags: ["נועה"] },
    ],
    upcoming: [
      { id: "u0", month: "אוק׳", day: "13", title: "יום ההולדת של נועה", sub: "בת שנה · חוגגים ב־10:30", tag: "יום הולדת", tone: "pink" },
      { id: "u1", month: "אוק׳", day: "20", title: "המשפחתון סגור", sub: "חג", tag: "חופשה", tone: "mute" },
      { id: "u2", month: "דצמ׳", day: "14", title: "מסיבת חנוכה", sub: "14:00 עם ההורים", tag: "אירוע", tone: "cool", rsvp: { going: 6, notGoing: 1, of: 10 } },
    ],
    staff: [
      { id: "s1", name: "מירב", role: "מטפלת", perms: ["נוכחות", "ארוחות ושינה", "טיפול", "תמונות"], present: true },
      { id: "s2", name: "יעל", role: "מטפלת", perms: ["נוכחות", "ארוחות ושינה", "טיפול", "תמונות"], present: true },
    ],
    leads: [],
    pickups: [{ childId: "k3", who: "רחל (סבתא)", time: "15:30" }],
    attendanceWeek: [
      { label: "א׳", present: 9, total: 10 },
      { label: "ב׳", present: 10, total: 10 },
      { label: "ג׳", present: 8, total: 10 },
      { label: "ד׳", present: 9, total: 10 },
      { label: "ה׳", present: 7, total: 10 },
    ],
    alerts: [
      { id: "a1", tone: "bad", lead: "אלרגיה לאגוזים:", text: "יובל. ארוחת ארבע ללא אגוזים" },
      { id: "a2", tone: "warn", lead: "שינוי באיסוף:", text: "מיה תיאסף היום על ידי סבתא רחל" },
    ],
  };
}
