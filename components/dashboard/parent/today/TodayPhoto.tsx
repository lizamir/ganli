import Scene from "@/components/dashboard/care/Scene";
import { Badge } from "@/components/dashboard/ui";
import type { CareEvent, Child, Photo } from "@/lib/domain/types";

type Props = { child: Child; photo?: Photo; last?: CareEvent; dayLabel: string; birthday: boolean };

/** The large picture at the top of the parent's day. On a birthday it becomes a celebration. */
export default function TodayPhoto({ child, photo, last, dayLabel, birthday }: Props) {
  return (
    <div className="relative [grid-row:span_1] min-h-[330px] overflow-hidden rounded-[28px]">
      <Scene
        name={birthday ? "party" : (photo?.scene ?? "sand")}
        label={birthday ? "יום הולדת" : photo?.caption}
        className="absolute inset-0 h-full w-full"
      />
      <span className="absolute start-4 top-4 rounded-[999px] bg-mustard px-3 py-1.5 font-heading text-[0.8125rem]/[normal] font-semibold text-[#3e2a08]">
        {birthday ? "יום הולדת שמח 🎂" : `התמונה האחרונה · ${photo?.time ?? ""}`}
      </span>
      <div className="absolute inset-x-4 top-auto bottom-4 flex items-center justify-between gap-3 rounded-[20px] bg-paper px-[18px] py-3.5 shadow-block">
        <div>
          <b className="block font-heading text-[1.375rem]/[1.2] font-semibold text-cocoa-deep">
            {birthday ? `${child.name} בת שנה היום!` : photo?.caption}
          </b>
          <span className="text-[0.875rem] text-subtle">
            {dayLabel} · עודכן לאחרונה {last?.end ?? last?.start ?? "—"}
          </span>
        </div>
        {birthday && <Badge tone="pink">חוגגים ב־10:30</Badge>}
      </div>
    </div>
  );
}
