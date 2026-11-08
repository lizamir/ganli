import Link from "next/link";
import {
  Badge,
  Card,
  Disc,
  inSmallText,
  miniButton,
  plainList,
  timelineDetail,
  timelineItem,
  timelineTitle,
} from "@/components/dashboard/ui";
import type { Charge, Child, Inquiry } from "@/lib/domain/types";

type Props = { consentMissing: Child[]; unpaid: Charge[]; openInquiries: Inquiry[] };

/** What the director should deal with today. */
export default function TodoCard({ consentMissing, unpaid, openInquiries }: Props) {
  return (
    <Card title="לטיפול">
      <ul className={plainList}>
        {consentMissing.length > 0 && (
          <li className={timelineItem}>
            <Disc icon="camera" color="var(--tomato)" className={inSmallText} />
            <div className="grid flex-1">
              <b className={timelineTitle}>{consentMissing.length} אישורי צילום חסרים</b>
              <span className={timelineDetail}>משפחות {consentMissing.map((c) => c.name).join(" ו")}</span>
            </div>
            <Badge tone="bad">דחוף</Badge>
          </li>
        )}
        {unpaid.length > 0 && (
          <li className={timelineItem}>
            <Disc icon="wallet" color="var(--mustard)" className={inSmallText} />
            <div className="grid flex-1">
              <b className={timelineTitle}>תזכורת תשלום</b>
              <span className={timelineDetail}>{unpaid.length} משפחות שטרם שילמו</span>
            </div>
            <Badge tone="warn">שליחה</Badge>
          </li>
        )}
        {openInquiries.length > 0 && (
          <li className={timelineItem}>
            <Disc icon="chat" color="var(--teal)" className={inSmallText} />
            <div className="grid flex-1">
              <b className={timelineTitle}>{openInquiries.length} פניות הורים פתוחות</b>
              <span className={timelineDetail}>{openInquiries[0].from}</span>
            </div>
            <Link href="/app/admin/messages/" className={miniButton}>
              מעבר
            </Link>
          </li>
        )}
        <li className={timelineItem}>
          <Disc icon="warn" color="#6b5fb5" className={inSmallText} />
          <div className="grid flex-1">
            <b className={timelineTitle}>הנחיית אלרגיה חדשה</b>
            <span className={timelineDetail}>יובל · ממתינה לאישור צוות</span>
          </div>
          <Badge tone="cool">בדיקה</Badge>
        </li>
      </ul>
    </Card>
  );
}
