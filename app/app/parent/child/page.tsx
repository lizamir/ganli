"use client";

import { Avatar, Badge, Card, PageHead } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";

export default function ChildCard() {
  const { data, profile } = useGanli();
  if (!data || !profile) return null;
  const child = data.children.find((c) => c.id === profile.childId) ?? data.children[0];

  return (
    <>
      <PageHead kicker="כרטיס ילד" title={child.name} />
      <div className="grid-2">
        <Card>
          <div className="child-hero">
            <Avatar name={child.name} color={child.color} size={84} />
            <div>
              <b>{child.name}</b>
              <span>נולדה ב־{child.birth}</span>
              <span>הורים: {child.parents || "—"}</span>
            </div>
          </div>
          <dl className="facts">
            <dt>אלרגיות</dt>
            <dd>{child.allergy || "אין אלרגיות ידועות"}</dd>
            <dt>הנחיות טיפול</dt>
            <dd>{child.careNotes || "—"}</dd>
            <dt>איסוף רגיל</dt>
            <dd>{child.pickup ?? "—"}</dd>
          </dl>
          <p className="hint-line">שינוי בפרטי טיפול רגישים נבדק על ידי הצוות לפני שהוא נכנס לתוקף.</p>
        </Card>
        <div className="stack">
          <Card title="אנשי קשר ומורשים לאיסוף">
            <ul className="people">
              <li>
                <b>דנה, אמא</b>
                <span dir="ltr">050-000-0001</span>
                <Badge tone="ok">מורשית איסוף</Badge>
              </li>
              <li>
                <b>איל, אבא</b>
                <span dir="ltr">050-000-0002</span>
                <Badge tone="ok">מורשה איסוף</Badge>
              </li>
              <li>
                <b>רחל, סבתא</b>
                <span dir="ltr">050-000-0003</span>
                <Badge tone="cool">חירום + איסוף</Badge>
              </li>
            </ul>
          </Card>
          <Card title="אישורים">
            <ul className="people">
              <li>
                <b>צילום והעלאה לאלבום הקבוצתי</b>
                <span>נוסח 2 · 01.09.2026</span>
                <Badge tone="ok">מאושר</Badge>
              </li>
              <li>
                <b>פעילות מחוץ למשפחתון</b>
                <span>נוסח 1 · 01.09.2026</span>
                <Badge tone="ok">מאושר</Badge>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
