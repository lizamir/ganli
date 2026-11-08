"use client";

import { useState } from "react";
import { useGanli } from "@/lib/data/GanliProvider";
import type { CareKind } from "@/lib/domain/types";
import {
  Avatar,
  fieldLabel,
  fieldsetPlain,
  formError,
  formOk,
  formRow,
  formStack,
  legendText,
  pickButton,
  pickRow,
  textInput,
} from "@/components/dashboard/ui";
import { KIND } from "@/components/dashboard/care/careKinds";
import Icon from "@/components/dashboard/ui/Icon";
import { cn } from "@/lib/ui/cn";

const PRESETS: Record<CareKind, { title: string; details: string[] }> = {
  meal: { title: "ארוחת ארבע", details: ["אכל/ה הכול", "אכל/ה חצי", "אכל/ה מעט"] },
  sleep: { title: "מנוחה", details: ["נרדם/ה בקלות", "שינה קצרה", "התעורר/ה רגוע/ה"] },
  care: { title: "החלפת חיתול", details: ["ללא הערות", "שירותים", "פריחה קלה, נמרח משחה"] },
};
const AMOUNT: Record<string, number> = { "אכל/ה הכול": 1, "אכל/ה חצי": 0.5, "אכל/ה מעט": 0.25 };

/** Log one care event for one or more children (the "group update" from the spec). */
export default function EventForm({
  initialKids = [],
  onDone,
}: {
  initialKids?: string[];
  onDone?: (n: number) => void;
}) {
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
    <form className={formStack} onSubmit={submit}>
      <fieldset className={fieldsetPlain}>
        <legend className={legendText}>למי?</legend>
        <div className={pickRow}>
          {present.map((c) => (
            <button
              type="button"
              key={c.id}
              className={pickButton(kids.includes(c.id), true)}
              aria-pressed={kids.includes(c.id)}
              onClick={() => toggle(c.id)}
            >
              <Avatar name={c.name} color={c.color} size={30} />
              {c.name}
            </button>
          ))}
          <button
            type="button"
            className={pickButton(false, true)}
            onClick={() => setKids(kids.length === present.length ? [] : present.map((c) => c.id))}
          >
            {kids.length === present.length ? "ניקוי" : "כל הקבוצה"}
          </button>
        </div>
      </fieldset>

      <fieldset className={fieldsetPlain}>
        <legend className={legendText}>מה עדכנו?</legend>
        <div className="grid grid-cols-[repeat(3,1fr)] gap-2.5 small:gap-2">
          {(["meal", "sleep", "care"] as CareKind[]).map((k) => (
            <button
              type="button"
              key={k}
              className={cn(
                "grid justify-items-center gap-1.5 rounded-[18px] border-2 border-solid bg-[var(--kt)] px-2 py-4 font-heading text-[1rem]/[normal] font-semibold text-[var(--ki)]",
                kind === k ? "border-[var(--k)] shadow-[0_4px_0_var(--k)]" : "border-transparent",
              )}
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

      <div className={formRow}>
        <label className={fieldLabel}>
          כותרת
          <input className={textInput} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label className={fieldLabel}>
          התחלה
          <input className={textInput} type="time" value={start} onChange={(e) => setStart(e.target.value)} required />
        </label>
        <label className={fieldLabel}>
          סיום {kind === "care" ? "(לא חובה)" : ""}
          <input className={textInput} type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
      </div>

      <fieldset className={fieldsetPlain}>
        <legend className={legendText}>פירוט</legend>
        <div className={pickRow}>
          {PRESETS[kind].details.map((d) => (
            <button
              type="button"
              key={d}
              className={pickButton(detail === d)}
              aria-pressed={detail === d}
              onClick={() => setDetail(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </fieldset>

      {error && (
        <p className={formError} role="alert">
          {error}
        </p>
      )}
      {saved != null && !error && (
        <p className={formOk} role="status">
          נשמר ל־{saved} ילדים. ההורים כבר רואים את העדכון ✓
        </p>
      )}
      <button className="btn btn-primary justify-center">
        שמירת עדכון {kids.length > 1 ? `ל־${kids.length} ילדים` : ""}
      </button>
    </form>
  );
}
