import { Badge, personBadge, personDetail, personName, personRow, plainList } from "@/components/dashboard/ui";
import type { Child, PlannedPickup } from "@/lib/domain/types";

/** Who is still here, and who is planned to collect them. */
export default function WaitingList({ present, pickups }: { present: Child[]; pickups: PlannedPickup[] }) {
  return (
    <ul className={plainList}>
      {present.map((c) => {
        const p = pickups.find((x) => x.childId === c.id);
        return (
          <li key={c.id} className={personRow}>
            <b className={personName}>{c.name}</b>
            <span className={personDetail}>{p ? `${p.who} · ${p.time}` : "לא תוכנן"}</span>
            <Badge tone={p ? "cool" : "mute"} className={personBadge}>
              {p ? "מתוכנן" : "רגיל"}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
}
