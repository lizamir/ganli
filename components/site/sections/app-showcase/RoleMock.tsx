import { useMemo } from "react";
import DayRibbon from "@/components/dashboard/care/DayRibbon";
import Scene from "@/components/dashboard/care/Scene";
import { Avatar, Badge } from "@/components/dashboard/ui";
import { createDemoSnapshot } from "@/lib/mock/demoSnapshot";

export type Tab = "parent" | "staff" | "admin";

/** A small preview of the app for one role, on demo data. */
export default function RoleMock({ tab }: { tab: Tab }) {
  const data = useMemo(() => createDemoSnapshot(), []);
  const noa = data.children[0];
  const noaEvents = data.events.filter((e) => e.childId === noa.id);

  if (tab === "parent") {
    return (
      <div className="mock mock-parent">
        <div className="mock-photo">
          <Scene name="sand" label="נועה בארגז חול" />
          <span>התמונה האחרונה · 13:52</span>
        </div>
        <div className="mock-card">
          <header>
            <b>היום של נועה</b>
            <Badge tone="ok" dot>
              בגן עכשיו
            </Badge>
          </header>
          <DayRibbon arrival={noa.arrival} now={data.now} events={noaEvents} />
        </div>
      </div>
    );
  }
  if (tab === "staff") {
    return (
      <div className="mock mock-staff">
        <div className="mock-alert">אלרגיה לאגוזים: יובל. ארוחת ארבע ללא אגוזים</div>
        {data.children.slice(0, 5).map((c) => (
          <div className="mock-row" key={c.id}>
            <Avatar name={c.name} color={c.color} size={34} />
            <b>{c.name}</b>
            <DayRibbon
              compact
              arrival={c.arrival}
              now={data.now}
              events={data.events.filter((e) => e.childId === c.id)}
            />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="mock mock-admin">
      <div className="mock-tiles">
        <div style={{ background: "var(--teal-deep)" }}>
          <small>נוכחים</small>
          <b>8/10</b>
        </div>
        <div style={{ background: "var(--tomato-btn)" }}>
          <small>צוות</small>
          <b>2/2</b>
        </div>
        <div style={{ background: "var(--mustard)", color: "#3e2a08" }}>
          <small>פניות</small>
          <b>3</b>
        </div>
      </div>
      <div className="mock-card">
        <header>
          <b>תשלומי אוקטובר</b>
          <span>6 מתוך 10 שולמו</span>
        </header>
        <div className="paybar">
          <span style={{ flex: 6, background: "#5fb59a" }} />
          <span style={{ flex: 3, background: "var(--mustard)" }} />
          <span style={{ flex: 1, background: "var(--tomato)" }} />
        </div>
      </div>
    </div>
  );
}
