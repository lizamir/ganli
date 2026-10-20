"use client";

import { MENU } from "@/lib/content";
import { allergensOf } from "@/lib/app/helpers";
import type { Child } from "@/lib/app/types";
import { Badge } from "./ui";

type Dish = { name: string; allergens: string[] };
const MEALS: { key: "morning" | "lunch" | "snack"; label: string; time: string }[] = [
  { key: "morning", label: "ארוחת בוקר", time: "08:30" },
  { key: "lunch", label: "ארוחת צהריים", time: "11:30" },
  { key: "snack", label: "ארוחת ארבע", time: "16:00" },
];

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
    <div className="menu-wrap">
      <div className="menu-legend" aria-label="מקרא אלרגנים">
        {Object.entries(MENU.allergenNames).map(([id, name]) => (
          <Badge key={id} tone="mute">
            {name}
          </Badge>
        ))}
      </div>
      <div className="menu-grid">
        {MENU.days.map((d, i) => (
          <section key={d.day} className={`menu-day${i === today ? " today" : ""}`} aria-label={`יום ${d.day}`}>
            <h2>
              יום {d.day}
              {i === today && <Badge tone="ok">היום</Badge>}
            </h2>
            {MEALS.map((m) => {
              const dish = d[m.key] as Dish;
              const hits = clashes(dish);
              return (
                <article key={m.key} className={`dish-card${hits.length ? " clash" : ""}`}>
                  <span className="dish-meal">
                    {m.label} · {m.time}
                  </span>
                  <b>{dish.name}</b>
                  <div className="dish-tags">
                    {dish.allergens.map((a) => (
                      <Badge key={a} tone="mute">
                        {MENU.allergenNames[a]}
                      </Badge>
                    ))}
                    {!dish.allergens.length && <Badge tone="ok">ללא אלרגנים עיקריים</Badge>}
                  </div>
                  {hits.map((h) => (
                    <p key={h.kid.id} className="dish-warn" role="alert">
                      {child ? `לא מתאים ל${h.kid.name}: ` : `${h.kid.name}: `}
                      {h.hits.map((x) => MENU.allergenNames[x]).join(", ")}. {child ? "הצוות יכין חלופה." : "להכין חלופה."}
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
