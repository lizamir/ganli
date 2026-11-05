import Link from "next/link";
import { Badge, Card, Disc } from "@/components/dashboard/ui";
import type { Charge, Child, Inquiry } from "@/lib/domain/types";

type Props = { consentMissing: Child[]; unpaid: Charge[]; openInquiries: Inquiry[] };

/** What the director should deal with today. */
export default function TodoCard({ consentMissing, unpaid, openInquiries }: Props) {
  return (
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
        {unpaid.length > 0 && (
          <li>
            <Disc icon="wallet" color="var(--mustard)" />
            <div>
              <b>תזכורת תשלום</b>
              <span>{unpaid.length} משפחות שטרם שילמו</span>
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
  );
}
