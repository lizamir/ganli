import type { GanliSnapshot } from "@/lib/domain/types";
import { tile, tileLabel, tileNote, tileValue, tileValueSmall, tilesGrid } from "@/components/dashboard/ui";

type Props = {
  data: GanliSnapshot;
  present: number;
  absent: number;
  openInquiries: number;
  paid: number;
  billed: number;
};

/** The four headline numbers of the day. */
export default function StatTiles({ data, present, absent, openInquiries, paid, billed }: Props) {
  return (
    <div className={tilesGrid()}>
      <div className={tile} style={{ background: "var(--teal-deep)" }}>
        <span className={tileLabel}>ילדים נוכחים</span>
        <b className={tileValue}>
          {present}
          <small className={tileValueSmall}> מתוך {data.children.length}</small>
        </b>
        <em className={tileNote}>{absent} נעדרים בדיווח הורים</em>
      </div>
      <div className={tile} style={{ background: "var(--tomato-btn)" }}>
        <span className={tileLabel}>צוות</span>
        <b className={tileValue}>
          {data.staff.filter((s) => s.present).length}
          <small className={tileValueSmall}> / {data.staff.length}</small>
        </b>
        <em className={tileNote}>{data.staff.map((s) => s.name).join(" · ")}</em>
      </div>
      <div className={tile} style={{ background: "var(--mustard)", color: "#3e2a08" }}>
        <span className={tileLabel}>פניות הורים</span>
        <b className={tileValue}>{openInquiries}</b>
        <em className={tileNote}>ממתינות לתשובה</em>
      </div>
      <div className={tile} style={{ background: "var(--cocoa)" }}>
        <span className={tileLabel}>תשלומי {data.currentPeriod.split(" ")[0]}</span>
        <b className={tileValue}>
          {paid}
          <small className={tileValueSmall}> / {billed}</small>
        </b>
        <em className={tileNote}>משפחות ששילמו</em>
      </div>
    </div>
  );
}
