import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Scene from "@/components/dashboard/care/Scene";
import { Avatar, Badge } from "@/components/dashboard/ui";
import type { FEATURES } from "@/content";

/** A decorative pickup QR code. */
function PickupQr() {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    QRCode.toString("GANLI-DEMO-NOA-4821", { type: "svg", margin: 0, color: { dark: "#3e322b", light: "#0000" } }).then(
      setSvg,
    );
  }, []);
  return <div className="qr" dangerouslySetInnerHTML={{ __html: svg }} aria-hidden="true" />;
}

/** The little illustration of one app feature. */
export default function FeatureVisual({ id }: { id: (typeof FEATURES)[number]["id"] }) {
  switch (id) {
    case "pickup":
      return (
        <div className="viz viz-pickup" aria-hidden="true">
          <PickupQr />
          <ul>
            <li>
              <Avatar name="ד" color="#f6c86e" size={30} /> דנה · אמא <Badge tone="ok">מורשית</Badge>
            </li>
            <li>
              <Avatar name="ר" color="#9fd8cf" size={30} /> רחל · סבתא <Badge tone="ok">מורשית</Badge>
            </li>
          </ul>
        </div>
      );
    case "menu":
      return (
        <div className="viz viz-menu" aria-hidden="true">
          <div className="dish">
            <span>שני · ארוחת ארבע</span>
            <b>עוגיות שקדים ביתיות</b>
            <Badge tone="bad">מכיל אגוזים</Badge>
          </div>
          <div className="dish safe">
            <span>שלישי · ארוחת ארבע</span>
            <b>יוגורט ופירות</b>
            <Badge tone="ok">מתאים ליובל</Badge>
          </div>
          <div className="dish">
            <span>רביעי · ארוחת בוקר</span>
            <b>קורנפלקס מלא עם חלב</b>
            <Badge tone="warn">חלב · גלוטן</Badge>
          </div>
        </div>
      );
    case "summary":
      return (
        <p className="viz viz-summary" aria-hidden="true">
          “נועה אכלה כמעט הכול, ישנה שעה ורבע וצחקה בארגז החול.”
        </p>
      );
    case "live":
      return (
        <div className="viz viz-live" aria-hidden="true">
          <span>מירב עדכנה: ארוחת צהריים</span>
          <span>נועה התעוררה משינה</span>
          <span>תמונה חדשה באלבום</span>
        </div>
      );
    case "albums":
      return (
        <div className="viz viz-albums" aria-hidden="true">
          <Scene name="paint" label="" />
          <Scene name="blocks" label="" />
          <span className="keep-chip">נשמר באלבום ✓</span>
        </div>
      );
    case "inbox":
      return (
        <div className="viz viz-inbox" aria-hidden="true">
          <p className="bubble in">אאחר באיסוף בעשרים דקות.</p>
          <p className="bubble out">אין בעיה, נחכה לכם 😊</p>
        </div>
      );
    case "money":
      return (
        <div className="viz viz-money" aria-hidden="true">
          <div className="paybar">
            <span style={{ flex: 6, background: "#5fb59a" }} />
            <span style={{ flex: 3, background: "var(--mustard)" }} />
            <span style={{ flex: 1, background: "var(--tomato)" }} />
          </div>
          <small>₪10,800 התקבלו</small>
        </div>
      );
    case "events":
      return (
        <div className="viz viz-events" aria-hidden="true">
          <span className="date-chip">
            <small>דצמ׳</small>
            <b>14</b>
          </span>
          <div>
            <b>מסיבת חנוכה</b>
            <span>מגיעים? ✓ כן · ✕ לא</span>
          </div>
        </div>
      );
  }
}
