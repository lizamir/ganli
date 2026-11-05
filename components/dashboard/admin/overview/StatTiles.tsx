import type { GanliSnapshot } from "@/lib/domain/types";

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
    <div className="tiles">
      <div className="tile" style={{ background: "var(--teal-deep)" }}>
        <span>ילדים נוכחים</span>
        <b>
          {present}
          <small> מתוך {data.children.length}</small>
        </b>
        <em>{absent} נעדרים בדיווח הורים</em>
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
        <b>{openInquiries}</b>
        <em>ממתינות לתשובה</em>
      </div>
      <div className="tile" style={{ background: "var(--cocoa)" }}>
        <span>תשלומי {data.currentPeriod.split(" ")[0]}</span>
        <b>
          {paid}
          <small> / {billed}</small>
        </b>
        <em>משפחות ששילמו</em>
      </div>
    </div>
  );
}
