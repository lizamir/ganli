"use client";

import { useState } from "react";
import GroupAlerts from "@/components/dashboard/staff/group/GroupAlerts";
import GroupBar from "@/components/dashboard/staff/group/GroupBar";
import KidsTable from "@/components/dashboard/staff/group/KidsTable";
import LogDrawer from "@/components/dashboard/staff/group/LogDrawer";
import Icon from "@/components/dashboard/ui/Icon";
import { Badge, PageHead } from "@/components/dashboard/ui";
import { useGanli } from "@/lib/data/GanliProvider";
import { lastUpdate, minutesSince, STALE_MINUTES } from "@/lib/domain/care";

/** The staff member's home: the whole group at a glance. */
export default function StaffGroup() {
  const { data } = useGanli();
  const [picked, setPicked] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  if (!data) return null;

  const present = data.children.filter((c) => c.status === "present");
  const absent = data.children.filter((c) => c.status === "absent");
  const collected = data.children.filter((c) => c.status === "left");
  const staleness = (id: string) => {
    const last = lastUpdate(data.events, id) ?? data.children.find((c) => c.id === id)?.arrival ?? data.now;
    return minutesSince(data.now, last);
  };
  const stale = present.filter((c) => staleness(c.id) >= STALE_MINUTES);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <>
      <PageHead
        kicker={`${data.dayLabel} · ${data.now}`}
        title="הקבוצה שלי"
        actions={
          <>
            <Badge tone="cool">
              {present.length} מתוך {data.children.length} נוכחים
            </Badge>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
              <Icon name="plus" size={18} /> עדכון חדש
            </button>
          </>
        }
      />

      <GroupAlerts alerts={data.alerts} stale={stale} />
      <KidsTable
        data={data}
        present={present}
        collected={collected}
        absent={absent}
        picked={picked}
        staleness={staleness}
        onToggle={toggle}
      />

      {picked.length > 0 && !open && (
        <GroupBar count={picked.length} onUpdate={() => setOpen(true)} onClear={() => setPicked([])} />
      )}

      {open && (
        <LogDrawer
          initialKids={picked}
          onClose={() => setOpen(false)}
          onDone={() => {
            setPicked([]);
            setTimeout(() => setOpen(false), 1200);
          }}
        />
      )}
    </>
  );
}
