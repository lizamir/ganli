import { useMemo } from "react";
import DayRibbon from "@/components/dashboard/care/DayRibbon";
import Scene from "@/components/dashboard/care/Scene";
import PayBar from "./PayBar";
import { Avatar, Badge } from "@/components/dashboard/ui";
import { createDemoSnapshot } from "@/lib/mock/demoSnapshot";

const mock = "grid min-h-[380px] [align-content:start] gap-[14px] bg-app p-[22px] mobile:min-h-0 mobile:p-[14px]";
const mockCard = "grid gap-[14px] rounded-[18px] bg-paper p-[18px]";
const mockHeader = "flex items-center justify-between gap-2.5";
const mockTitle = "text-[1.15rem] text-cocoa-deep";
const tile = "grid gap-1 rounded-[18px] p-4 text-white";
const tileLabel = "text-[0.85rem] font-bold";
const tileValue = "[font:900_2.2rem/1_var(--font-display)]";

export type Tab = "parent" | "staff" | "admin";

/** A small preview of the app for one role, on demo data. */
export default function RoleMock({ tab }: { tab: Tab }) {
  const data = useMemo(() => createDemoSnapshot(), []);
  const noa = data.children[0];
  const noaEvents = data.events.filter((e) => e.childId === noa.id);

  if (tab === "parent") {
    return (
      <div className={mock}>
        <div className="relative h-[176px] overflow-hidden rounded-[20px]">
          <Scene name="sand" label="נועה בארגז חול" className="absolute inset-0 h-full w-full" />
          <span className="absolute start-3 top-3 rounded-[999px] bg-mustard px-[11px] py-[5px] text-[0.8rem] font-bold text-[#3e2a08]">
            התמונה האחרונה · 13:52
          </span>
        </div>
        <div className={mockCard}>
          <header className={mockHeader}>
            <b className={mockTitle}>היום של נועה</b>
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
      <div className={mock}>
        <div className="rounded-[14px] bg-[#ffd9d4] px-[14px] py-2.5 text-[0.92rem] font-bold text-[#8f1d12]">
          אלרגיה לאגוזים: יובל. ארוחת ארבע ללא אגוזים
        </div>
        {data.children.slice(0, 5).map((c) => (
          <div
            className="grid grid-cols-[34px_70px_1fr] items-center gap-3 rounded-[16px] bg-paper px-[14px] py-2.5 mobile:grid-cols-[34px_54px_1fr] mobile:gap-2 mobile:px-2.5 mobile:py-2"
            key={c.id}
          >
            <Avatar name={c.name} color={c.color} size={34} />
            <b className="text-[1rem] text-cocoa-deep">{c.name}</b>
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
    <div className={mock}>
      <div className="grid grid-cols-[repeat(3,1fr)] gap-3">
        <div className={tile} style={{ background: "var(--teal-deep)" }}>
          <small className={tileLabel}>נוכחים</small>
          <b className={tileValue}>8/10</b>
        </div>
        <div className={tile} style={{ background: "var(--tomato-btn)" }}>
          <small className={tileLabel}>צוות</small>
          <b className={tileValue}>2/2</b>
        </div>
        <div className={tile} style={{ background: "var(--mustard)", color: "#3e2a08" }}>
          <small className={tileLabel}>פניות</small>
          <b className={tileValue}>3</b>
        </div>
      </div>
      <div className={mockCard}>
        <header className={mockHeader}>
          <b className={mockTitle}>תשלומי אוקטובר</b>
          <span className="text-[0.85rem] text-muted">6 מתוך 10 שולמו</span>
        </header>
        <PayBar />
      </div>
    </div>
  );
}
