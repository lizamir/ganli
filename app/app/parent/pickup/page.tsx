"use client";

import { useState } from "react";
import QrCode from "@/components/dashboard/care/QrCode";
import {
  Avatar,
  Badge,
  Card,
  PageHead,
  fieldLabel,
  fieldsetPlain,
  formMessage,
  formStack,
  grid2,
  hintLine,
  legendText,
  personBadge,
  personName,
  personRow,
  pickButton,
  pickRow,
  plainList,
  plainSelect,
} from "@/components/dashboard/ui";
import { authorizedLabel, pickupCode, qrPayload } from "@/lib/domain/pickup";
import { useGanli } from "@/lib/data/GanliProvider";

const TIMES = ["15:00", "15:30", "16:00", "16:30", "17:00"];

/** Today's pickup code for the parent, and who is planned to collect the child. */
export default function ParentPickup() {
  const { data, profile, actions, mode } = useGanli();
  const [who, setWho] = useState("");
  const [time, setTime] = useState("16:00");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  if (!data || !profile) return null;

  const child = data.children.find((c) => c.id === profile.childId) ?? data.children[0];
  const code = pickupCode(child.id);
  const planned = data.pickups.find((p) => p.childId === child.id);
  const chosen = who || planned?.who || (child.authorized[0] ? authorizedLabel(child.authorized[0]) : "");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = await actions.planPickup(child.id, chosen, time);
    setMsg(
      err
        ? { ok: false, text: err }
        : { ok: true, text: `נשמר: ${chosen} אוספ/ת את ${child.name} בסביבות ${time}. הצוות רואה את זה.` },
    );
  };

  return (
    <>
      <PageHead kicker="איסוף" title={`איסוף של ${child.name}`} actions={<Badge tone="ok">קוד תקף להיום</Badge>} />
      <div className={grid2}>
        <Card title="קוד האיסוף להיום">
          <div className="flex flex-wrap items-center gap-7 mobile:justify-center">
            <QrCode value={qrPayload(child.id)} label={`קוד QR לאיסוף של ${child.name}`} />
            <div className="grid min-w-[200px] flex-1 gap-[6px]">
              <span className="font-semibold text-muted">או לומר לצוות את הקוד</span>
              <b
                dir="ltr"
                className="tracking-[0.08em] text-cocoa-deep [font:900_2.8rem/1_var(--font-display)] mobile:text-[2.2rem]"
              >
                {code.slice(0, 3)} {code.slice(3)}
              </b>
              <small className="text-[0.9rem] text-muted">
                הקוד מתחדש מדי יום. הצוות מאמת אותו מול הרשימה לפני שהילד יוצא.
              </small>
            </div>
          </div>
        </Card>

        <Card title="מי אוסף היום?" note="אפשר לשנות עד רגע האיסוף">
          <form className={formStack} onSubmit={save}>
            <fieldset className={fieldsetPlain}>
              <legend className={legendText}>מורשים לאיסוף</legend>
              <div className={pickRow}>
                {child.authorized.map((a) => {
                  const label = authorizedLabel(a);
                  return (
                    <button
                      type="button"
                      key={label}
                      className={pickButton(chosen === label)}
                      aria-pressed={chosen === label}
                      onClick={() => setWho(label)}
                    >
                      <Avatar name={a.name} color="#f6c86e" size={26} /> {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <label className={fieldLabel}>
              שעה משוערת
              <select value={time} onChange={(e) => setTime(e.target.value)} className={plainSelect}>
                {TIMES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            {msg && (
              <p className={formMessage(msg.ok)} role="status">
                {msg.text}
              </p>
            )}
            <button className="btn btn-primary justify-center">שמירה</button>
            {planned && !msg && (
              <p className={hintLine}>
                כרגע רשום: {planned.who} בסביבות {planned.time}.
              </p>
            )}
          </form>
        </Card>
      </div>
      <Card title="רשימת המורשים">
        <ul className={plainList}>
          {child.authorized.map((a) => (
            <li key={a.name + a.relation} className={personRow}>
              <b className={personName}>
                {a.name} · {a.relation}
              </b>
              <Badge tone="ok" className={personBadge}>
                מורשה איסוף
              </Badge>
            </li>
          ))}
        </ul>
        <p className={hintLine}>
          להוספת מורשה (למשל שכן או בן משפחה) פנו למנהלת. בקשת שינוי באיסוף אינה מחליפה אישור של הצוות בפועל.
        </p>
        {mode === "supabase" && <p className={hintLine}>במצב שרת, תכנון האיסוף עדיין לא נשמר. הקוד והרשימה עובדים.</p>}
      </Card>
    </>
  );
}
