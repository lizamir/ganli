"use client";

import { useState } from "react";
import { useGanli } from "@/lib/app/store";
import type { CareKind } from "@/lib/app/types";
import { Avatar, KIND } from "./ui";
import Icon from "./Icon";

const PRESETS: Record<CareKind, { title: string; details: string[] }> = {
  meal: { title: "ארוחת ארבע", details: ["אכל/ה הכול", "אכל/ה חצי", "אכל/ה מעט"] },
  sleep: { title: "מנוחה", details: ["נרדם/ה בקלות", "שינה קצרה", "התעורר/ה רגוע/ה"] },
  care: { title: "החלפת חיתול", details: ["ללא הערות", "שירותים", "פריחה קלה, נמרח משחה"] },
};
const AMOUNT: Record<string, number> = { "אכל/ה הכול": 1, "אכל/ה חצי": 0.5, "אכל/ה מעט": 0.25 };

/** Log one care event for one or more children (the "group update" from the spec). */
export default function EventForm({ initialKids = [], onDone }: { initialKids?: string[]; onDone?: (n: number) => void }) {
  const { data, profile, actions } = useGanli();
  const [kids, setKids] = useState<string[]>(initialKids);
  const [kind, setKind] = useState<CareKind>("meal");
  const [start, setStart] = useState(data?.now ?? "15:00");
  const [end, setEnd] = useState("");
  const [detail, setDetail] = useState(PRESETS.meal.details[0]);
  const [title, setTitle] = useState(PRESETS.meal.title);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  if (!data) return null;

  const present = data.children.filter((c) => c.status === "present");
  const toggle = (id: string) => setKids((k) => (k.includes(id) ? k.filter((x) => x !== id) : [...k, id]));
  const chooseKind = (k: CareKind) => {
    setKind(k);
    setTitle(PRESETS[k].title);
    setDetail(PRESETS[k].details[0]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kids.length) return setError("בחרו לפחות ילד אחד");
    if (end && end < start) return setError("שעת הסיום לפני שעת ההתחלה");
    setError(null);
    for (const childId of kids) {
      const err = await actions.addEvent({
        childId,
        kind,
        start,
        end: end || undefined,
        title,
        detail,
        amount: kind === "meal" ? AMOUNT[detail] : undefined,
        by: profile?.name,
      });
      if (err) return setError(err);
    }
    setSaved(kids.length);
    onDone?.(kids.length);
    setKids([]);
  };

  return (
    <form className="event-form" onSubmit={submit}>
      <fieldset>
        <legend>למי?</legend>
        <div className="kid-picks">
          {present.map((c) => (
            <button type="button" key={c.id} className={kids.includes(c.id) ? "on" : undefined} aria-pressed={kids.includes(c.id)} onClick={() => toggle(c.id)}>
              <Avatar name={c.name} color={c.color} size={30} />
              {c.name}
            </button>
          ))}
          <button type="button" className="link-btn" onClick={() => setKids(kids.length === present.length ? [] : present.map((c) => c.id))}>
            {kids.length === present.length ? "ניקוי" : "כל הקבוצה"}
          </button>
        </div>
      </fieldset>

      <fieldset>
        <legend>מה עדכנו?</legend>
        <div className="kind-picks">
          {(["meal", "sleep", "care"] as CareKind[]).map((k) => (
            <button
              type="button"
              key={k}
              className={kind === k ? "on" : undefined}
              aria-pressed={kind === k}
              style={{ "--k": KIND[k].color, "--kt": KIND[k].tint, "--ki": KIND[k].ink } as React.CSSProperties}
              onClick={() => chooseKind(k)}
            >
              <Icon name={KIND[k].icon} />
              {KIND[k].label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="form-row">
        <label>
          כותרת
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          התחלה
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} required />
        </label>
        <label>
          סיום {kind === "care" ? "(לא חובה)" : ""}
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
      </div>

      <fieldset>
        <legend>פירוט</legend>
        <div className="detail-picks">
          {PRESETS[kind].details.map((d) => (
            <button type="button" key={d} className={detail === d ? "on" : undefined} aria-pressed={detail === d} onClick={() => setDetail(d)}>
              {d}
            </button>
          ))}
        </div>
      </fieldset>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {saved != null && !error && (
        <p className="form-ok" role="status">
          נשמר ל־{saved} ילדים. ההורים כבר רואים את העדכון ✓
        </p>
      )}
      <button className="btn btn-primary">שמירת עדכון {kids.length > 1 ? `ל־${kids.length} ילדים` : ""}</button>
    </form>
  );
}
