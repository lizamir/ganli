"use client";

import Link from "next/link";
import AttendanceChart from "@/components/app/AttendanceChart";
import Icon from "@/components/app/Icon";
import { Avatar, Badge, Card, Disc, PageHead, shekel } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export default function AdminHome() {
  const { data } = useGanli();
  if (!data) return null;

  const present = data.children.filter((c) => c.status === "present" || c.status === "left");
  const absent = data.children.filter((c) => c.status === "absent");
  const month = data.charges.filter((c) => c.period === data.currentPeriod);
  const paid = month.filter((c) => c.paid >= c.amount);
  const late = month.filter((c) => c.paid < c.amount && c.late);
  const pending = month.filter((c) => c.paid < c.amount && !late.includes(c));
  const sum = (list: typeof month) => shekel(list.reduce((s, c) => s + c.amount - (list === paid ? 0 : c.paid), 0));
  const openInquiries = data.inquiries.filter((q) => !q.done);
  const coverage = (id: string) => {
    const last = data.events.filter((e) => e.childId === id).map((e) => e.end ?? e.start).sort().at(-1);
    return last && toMin(data.now) - toMin(last) < 120 ? "g" : "y";
  };
  const consentMissing = data.children.filter((c) => c.consentMissing);

  return (
    <>
      <PageHead kicker={`${data.dayLabel} · ${data.now}`} title={data.institution} />

      <div className="tiles">
        <div className="tile" style={{ background: "var(--teal-deep)" }}>
          <span>ילדים נוכחים</span>
          <b>
            {present.length}
            <small> מתוך {data.children.length}</small>
          </b>
          <em>{absent.length} נעדרים בדיווח הורים</em>
        </div>
        <div className="tile" style={{ background: "var(--tomato-btn)" }}>
          <span>צוות</span>
          <b>
            {data.staff.filter((s) => s.present).length}
            <small> / {data.staff.length}</small>
          </b>
          <em>{data.staff.map((s) => s.name).join(" · ")}</em>
        </div>
        <div className="tile" style={{ background: "var(--mustard)", color: "#3e2a08" }}>
          <span>פניות הורים</span>
          <b>{openInquiries.length}</b>
          <em>ממתינות לתשובה</em>
        </div>
        <div className="tile" style={{ background: "var(--cocoa)" }}>
          <span>תשלומי {data.currentPeriod.split(" ")[0]}</span>
          <b>
            {paid.length}
            <small> / {month.length}</small>
          </b>
          <em>משפחות ששילמו</em>
        </div>
      </div>

      <div className="grid-admin">
        <Card title="עדכונים אחרונים" note="לפי ילד">
          <div className="coverage">
            {data.children.map((c) => {
              const st = c.status === "absent" ? "x" : coverage(c.id);
              return (
                <div key={c.id} className={`cov cov-${st}`}>
                  <Avatar name={c.name} color={st === "g" ? "#9fd8cf" : st === "y" ? "#f6c86e" : "#e7ded2"} size={44} />
                  <span>{c.name}</span>
                </div>
              );
            })}
          </div>
          <div className="legend">
            <Badge tone="ok">עודכן בשעתיים האחרונות</Badge>
            <Badge tone="warn">יותר משעתיים</Badge>
            <Badge tone="mute">נעדר</Badge>
          </div>
        </Card>

        <Card title={`תשלומים · ${data.currentPeriod}`} note={<Link href="/app/admin/finance/">לכל הכספים ←</Link>}>
          <div className="paybar" role="img" aria-label={`${paid.length} שולמו, ${pending.length} ממתינים, ${late.length} באיחור`}>
            <span style={{ flex: paid.length, background: "#5fb59a" }} />
            <span style={{ flex: pending.length, background: "var(--mustard)" }} />
            <span style={{ flex: late.length, background: "var(--tomato)" }} />
          </div>
          <div className="pay-tiles">
            <div className="tone-ok">
              <b>{paid.length}</b>
              <span>שולם</span>
              <small>{sum(paid)}</small>
            </div>
            <div className="tone-warn">
              <b>{pending.length}</b>
              <span>ממתין</span>
              <small>{sum(pending)}</small>
            </div>
            <div className="tone-bad">
              <b>{late.length}</b>
              <span>באיחור</span>
              <small>{sum(late)}</small>
            </div>
          </div>
        </Card>

        <Card title="לטיפול">
          <ul className="todo">
            {consentMissing.length > 0 && (
              <li>
                <Disc icon="camera" color="var(--tomato)" />
                <div>
                  <b>{consentMissing.length} אישורי צילום חסרים</b>
                  <span>משפחות {consentMissing.map((c) => c.name).join(" ו")}</span>
                </div>
                <Badge tone="bad">דחוף</Badge>
              </li>
            )}
            {pending.length + late.length > 0 && (
              <li>
                <Disc icon="wallet" color="var(--mustard)" />
                <div>
                  <b>תזכורת תשלום</b>
                  <span>{pending.length + late.length} משפחות שטרם שילמו</span>
                </div>
                <Badge tone="warn">שליחה</Badge>
              </li>
            )}
            {openInquiries.length > 0 && (
              <li>
                <Disc icon="chat" color="var(--teal)" />
                <div>
                  <b>{openInquiries.length} פניות הורים פתוחות</b>
                  <span>{openInquiries[0].from}</span>
                </div>
                <Link href="/app/admin/messages/" className="mini-btn">
                  מעבר
                </Link>
              </li>
            )}
            <li>
              <Disc icon="warn" color="#6b5fb5" />
              <div>
                <b>הנחיית אלרגיה חדשה</b>
                <span>יובל · ממתינה לאישור צוות</span>
              </div>
              <Badge tone="cool">בדיקה</Badge>
            </li>
          </ul>
        </Card>

        <Card title="נוכחות השבוע" note="ילדים שהגיעו בכל יום">
          <AttendanceChart week={data.attendanceWeek} />
        </Card>

        <Card title="בקרוב">
          <ul className="upcoming">
            {data.upcoming.map((u) => (
              <li key={u.id}>
                <span className="date-chip">
                  <small>{u.month}</small>
                  <b>{u.day}</b>
                </span>
                <div>
                  <b>{u.title}</b>
                  <span>{u.sub}{u.rsvp ? ` · ${u.rsvp.going} מגיעים, ${u.rsvp.of - u.rsvp.going - u.rsvp.notGoing} טרם ענו` : ""}</span>
                </div>
                <Badge tone={u.tone}>{u.tag}</Badge>
              </li>
            ))}
          </ul>
          <Link href="/app/admin/messages/" className="add-link">
            <Icon name="plus" size={16} /> הודעה חדשה להורים
          </Link>
        </Card>
      </div>
    </>
  );
}
