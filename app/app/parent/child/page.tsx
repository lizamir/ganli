"use client";

import {
  Avatar,
  Badge,
  Card,
  PageHead,
  factTerm,
  factValue,
  facts,
  grid2,
  hintLine,
  personBadge,
  personDetail,
  personName,
  personRow,
  plainList,
  stack,
} from "@/components/dashboard/ui";
import { useGanli } from "@/lib/data/GanliProvider";

const heroDetail = "block text-[0.9375rem] text-subtle";

/** The child's details and care notes. */
export default function ChildCard() {
  const { data, profile } = useGanli();
  if (!data || !profile) return null;
  const child = data.children.find((c) => c.id === profile.childId) ?? data.children[0];

  return (
    <>
      <PageHead kicker="כרטיס ילד" title={child.name} />
      <div className={grid2}>
        <Card>
          <div className="flex items-center gap-[18px]">
            <Avatar name={child.name} color={child.color} size={84} />
            <div>
              <b className="block font-heading text-[1.875rem]/[normal] font-bold text-cocoa-deep">{child.name}</b>
              <span className={heroDetail}>נולדה ב־{child.birth}</span>
              <span className={heroDetail}>הורים: {child.parents || "—"}</span>
            </div>
          </div>
          <dl className={facts}>
            <dt className={factTerm}>אלרגיות</dt>
            <dd className={factValue}>{child.allergy || "אין אלרגיות ידועות"}</dd>
            <dt className={factTerm}>הנחיות טיפול</dt>
            <dd className={factValue}>{child.careNotes || "—"}</dd>
            <dt className={factTerm}>איסוף רגיל</dt>
            <dd className={factValue}>{child.pickup ?? "—"}</dd>
          </dl>
          <p className={hintLine}>שינוי בפרטי טיפול רגישים נבדק על ידי הצוות לפני שהוא נכנס לתוקף.</p>
        </Card>
        <div className={stack}>
          <Card title="אנשי קשר ומורשים לאיסוף">
            <ul className={plainList}>
              <li className={personRow}>
                <b className={personName}>דנה, אמא</b>
                <span className={personDetail} dir="ltr">
                  050-000-0001
                </span>
                <Badge tone="ok" className={personBadge}>
                  מורשית איסוף
                </Badge>
              </li>
              <li className={personRow}>
                <b className={personName}>איל, אבא</b>
                <span className={personDetail} dir="ltr">
                  050-000-0002
                </span>
                <Badge tone="ok" className={personBadge}>
                  מורשה איסוף
                </Badge>
              </li>
              <li className={personRow}>
                <b className={personName}>רחל, סבתא</b>
                <span className={personDetail} dir="ltr">
                  050-000-0003
                </span>
                <Badge tone="cool" className={personBadge}>
                  חירום + איסוף
                </Badge>
              </li>
            </ul>
          </Card>
          <Card title="אישורים">
            <ul className={plainList}>
              <li className={personRow}>
                <b className={personName}>צילום והעלאה לאלבום הקבוצתי</b>
                <span className={personDetail}>נוסח 2 · 01.09.2026</span>
                <Badge tone="ok" className={personBadge}>
                  מאושר
                </Badge>
              </li>
              <li className={personRow}>
                <b className={personName}>פעילות מחוץ למשפחתון</b>
                <span className={personDetail}>נוסח 1 · 01.09.2026</span>
                <Badge tone="ok" className={personBadge}>
                  מאושר
                </Badge>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
