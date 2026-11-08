import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Scene from "@/components/dashboard/care/Scene";
import PayBar from "./PayBar";
import { Avatar, Badge, DateChip } from "@/components/dashboard/ui";
import type { FEATURES } from "@/content";
import { cn } from "@/lib/ui/cn";

const viz = "min-h-[90px]";
const pickupRow = "flex items-center gap-2.5 rounded-[14px] bg-paper px-3 py-2 text-[0.92rem] font-semibold";
const dish = "grid justify-items-start gap-1 rounded-[16px] bg-paper px-[14px] py-3";
const dishMeal = "text-[0.78rem] font-semibold text-muted";
const dishName = "text-[1rem] text-cocoa-deep";
const liveLine = "block rounded-[14px] bg-paper px-[13px] py-[9px] text-[0.9rem] font-semibold opacity-0";
const albumPhoto = "block aspect-[4/3] w-full rounded-[14px]";
// Size and spacing as the card copy rule has always rendered them.
const bubble = "mt-[6px] max-w-[80%] rounded-[18px] px-[14px] py-2.5 text-[0.98rem] font-semibold";

/** A decorative pickup QR code. */
function PickupQr() {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    QRCode.toString("GANLI-DEMO-NOA-4821", { type: "svg", margin: 0, color: { dark: "#3e322b", light: "#0000" } }).then(
      setSvg,
    );
  }, []);
  return (
    <div
      className="w-[120px] flex-none rounded-[18px] bg-paper p-3 shadow-block [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-hidden="true"
    />
  );
}

/** The little illustration of one app feature. */
export default function FeatureVisual({ id }: { id: (typeof FEATURES)[number]["id"] }) {
  switch (id) {
    case "pickup":
      return (
        <div className={cn(viz, "flex items-center gap-[22px]")} aria-hidden="true">
          <PickupQr />
          <ul className="grid flex-1 list-none gap-2 p-0">
            <li className={pickupRow}>
              <Avatar name="ד" color="#f6c86e" size={30} /> דנה · אמא <Badge tone="ok">מורשית</Badge>
            </li>
            <li className={pickupRow}>
              <Avatar name="ר" color="#9fd8cf" size={30} /> רחל · סבתא <Badge tone="ok">מורשית</Badge>
            </li>
          </ul>
        </div>
      );
    case "menu":
      return (
        <div className={cn(viz, "grid [align-content:start] gap-2.5")} aria-hidden="true">
          <div className={dish}>
            <span className={dishMeal}>שני · ארוחת ארבע</span>
            <b className={dishName}>עוגיות שקדים ביתיות</b>
            <Badge tone="bad">מכיל אגוזים</Badge>
          </div>
          <div className={dish}>
            <span className={dishMeal}>שלישי · ארוחת ארבע</span>
            <b className={dishName}>יוגורט ופירות</b>
            <Badge tone="ok">מתאים ליובל</Badge>
          </div>
          <div className={dish}>
            <span className={dishMeal}>רביעי · ארוחת בוקר</span>
            <b className={dishName}>קורנפלקס מלא עם חלב</b>
            <Badge tone="warn">חלב · גלוטן</Badge>
          </div>
        </div>
      );
    case "summary":
      // Kept as it has always rendered: the card copy rule sized this quote like the card text.
      return (
        <p className={cn(viz, "mt-[6px] text-muted [font:700_0.98rem/1.4_var(--font-display)]")} aria-hidden="true">
          “נועה אכלה כמעט הכול, ישנה שעה ורבע וצחקה בארגז החול.”
        </p>
      );
    case "live":
      return (
        <div className={cn(viz, "grid gap-2")} aria-hidden="true">
          <span className={cn(liveLine, "animate-[pop_7s_infinite]")}>מירב עדכנה: ארוחת צהריים</span>
          <span className={cn(liveLine, "animate-[pop_7s_1.2s_infinite]")}>נועה התעוררה משינה</span>
          <span className={cn(liveLine, "animate-[pop_7s_2.4s_infinite]")}>תמונה חדשה באלבום</span>
        </div>
      );
    case "albums":
      return (
        <div className={cn(viz, "relative grid grid-cols-[1fr_1fr] gap-2")} aria-hidden="true">
          <Scene name="paint" label="" className={albumPhoto} />
          <Scene name="blocks" label="" className={albumPhoto} />
          <span className="absolute start-2 bottom-2 rounded-[999px] bg-teal-deep px-[11px] py-[5px] text-[0.8rem] font-bold text-white">
            נשמר באלבום ✓
          </span>
        </div>
      );
    case "inbox":
      return (
        <div className={cn(viz, "grid gap-2")} aria-hidden="true">
          <p className={cn(bubble, "[justify-self:start] rounded-ee-[4px] bg-paper text-muted")}>
            אאחר באיסוף בעשרים דקות.
          </p>
          <p className={cn(bubble, "[justify-self:end] rounded-es-[4px] bg-teal-deep text-white")}>
            אין בעיה, נחכה לכם 😊
          </p>
        </div>
      );
    case "money":
      return (
        <div className={cn(viz, "grid gap-2.5")} aria-hidden="true">
          <PayBar />
          <small className="font-bold text-muted">₪10,800 התקבלו</small>
        </div>
      );
    case "events":
      return (
        <div className={cn(viz, "flex items-center gap-[14px]")} aria-hidden="true">
          <DateChip month="דצמ׳" day="14" className="text-[0.9rem] text-muted [&_b]:text-cocoa-deep" />
          <div className="grid">
            <b className="text-[1.1rem] text-cocoa-deep">מסיבת חנוכה</b>
            <span className="text-[0.9rem] text-muted">מגיעים? ✓ כן · ✕ לא</span>
          </div>
        </div>
      );
  }
}
