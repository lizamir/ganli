"use client";

import { MENU } from "@/content";
import { allergensOf } from "@/lib/domain/allergens";
import type { Child } from "@/lib/domain/types";
import { Badge } from "@/components/dashboard/ui";
import { cn } from "@/lib/ui/cn";

type Dish = { name: string; allergens: string[] };
const MEALS: { key: "morning" | "lunch" | "snack"; label: string; time: string }[] = [
  { key: "morning", label: "ארוחת בוקר", time: "08:30" },
  { key: "lunch", label: "ארוחת צהריים", time: "11:30" },
  { key: "snack", label: "ארוחת ארבע", time: "16:00" },
];

const menuDay = "grid gap-[10px] rounded-[24px] bg-paper p-4 shadow-[0_14px_30px_-24px_rgba(62,50,43,0.5)]";
const dishCard = "grid justify-items-start gap-[6px] rounded-[16px] bg-cream p-3";

/** The weekly menu. For a parent, dishes that clash with the child's allergies are flagged.
 *  For staff, each dish lists the children to watch. */
export default function MenuView({ child, kids }: { child?: Child; kids?: Child[] }) {
  const today = new Date().getDay(); // Sun = 0 .. Thu = 4
  const watched = child ? [child] : (kids ?? []).filter((k) => k.allergy);

  const clashes = (dish: Dish) =>
    watched
      .map((k) => ({ kid: k, hits: allergensOf(k.allergy).filter((a) => dish.allergens.includes(a)) }))
      .filter((x) => x.hits.length);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2" aria-label="מקרא אלרגנים">
        {Object.entries(MENU.allergenNames).map(([id, name]) => (
          <Badge key={id} tone="mute">
            {name}
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-[repeat(5,1fr)] [align-items:start] gap-[14px] mobile:grid-cols-[1fr_1fr] small:grid-cols-[1fr]">
        {MENU.days.map((d, i) => (
          <section
            key={d.day}
            className={cn(menuDay, i === today && "[outline:3px_solid_var(--teal-deep)]")}
            aria-label={`יום ${d.day}`}
          >
            <h2 className="flex items-center justify-between gap-2 text-[1.15rem]">
              יום {d.day}
              {i === today && <Badge tone="ok">היום</Badge>}
            </h2>
            {MEALS.map((m) => {
              const dish = d[m.key] as Dish;
              const hits = clashes(dish);
              return (
                <article
                  key={m.key}
                  className={cn(dishCard, hits.length > 0 && "bg-[#ffe9e5] [outline:2px_solid_#8f1d12]")}
                >
                  <span className="text-[0.78rem] font-bold text-muted">
                    {m.label} · {m.time}
                  </span>
                  <b className="text-[0.98rem] leading-[1.3] text-cocoa-deep">{dish.name}</b>
                  <div className="flex flex-wrap gap-1">
                    {dish.allergens.map((a) => (
                      <Badge key={a} tone="mute">
                        {MENU.allergenNames[a]}
                      </Badge>
                    ))}
                    {!dish.allergens.length && <Badge tone="ok">ללא אלרגנים עיקריים</Badge>}
                  </div>
                  {hits.map((h) => (
                    <p key={h.kid.id} className="text-[0.85rem] font-bold text-[#8f1d12]" role="alert">
                      {child ? `לא מתאים ל${h.kid.name}: ` : `${h.kid.name}: `}
                      {h.hits.map((x) => MENU.allergenNames[x]).join(", ")}.{" "}
                      {child ? "הצוות יכין חלופה." : "להכין חלופה."}
                    </p>
                  ))}
                </article>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
