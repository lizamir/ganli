import Scene from "@/components/dashboard/care/Scene";
import { Badge } from "@/components/dashboard/ui";
import type { CareEvent, Child, Photo } from "@/lib/domain/types";

type Props = { child: Child; photo?: Photo; last?: CareEvent; dayLabel: string; birthday: boolean };

/** The large picture at the top of the parent's day. On a birthday it becomes a celebration. */
export default function TodayPhoto({ child, photo, last, dayLabel, birthday }: Props) {
  return (
    <div className="hero-photo">
      <Scene name={birthday ? "party" : (photo?.scene ?? "sand")} label={birthday ? "יום הולדת" : photo?.caption} />
      <span className="hero-photo-tag">{birthday ? "יום הולדת שמח 🎂" : `התמונה האחרונה · ${photo?.time ?? ""}`}</span>
      <div className="hero-photo-card">
        <div>
          <b>{birthday ? `${child.name} בת שנה היום!` : photo?.caption}</b>
          <span>
            {dayLabel} · עודכן לאחרונה {last?.end ?? last?.start ?? "—"}
          </span>
        </div>
        {birthday && <Badge tone="pink">חוגגים ב־10:30</Badge>}
      </div>
    </div>
  );
}
