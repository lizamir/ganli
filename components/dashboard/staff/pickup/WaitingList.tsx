import { Badge } from "@/components/dashboard/ui";
import type { Child, PlannedPickup } from "@/lib/domain/types";

/** Who is still here, and who is planned to collect them. */
export default function WaitingList({ present, pickups }: { present: Child[]; pickups: PlannedPickup[] }) {
  return (
    <ul className="people">
      {present.map((c) => {
        const p = pickups.find((x) => x.childId === c.id);
        return (
          <li key={c.id}>
            <b>{c.name}</b>
            <span>{p ? `${p.who} · ${p.time}` : "לא תוכנן"}</span>
            {p ? <Badge tone="cool">מתוכנן</Badge> : <Badge tone="mute">רגיל</Badge>}
          </li>
        );
      })}
    </ul>
  );
}
