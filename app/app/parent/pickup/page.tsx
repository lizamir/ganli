"use client";

import { useState } from "react";
import QrCode from "@/components/app/QrCode";
import { Avatar, Badge, Card, PageHead } from "@/components/app/ui";
import { pickupCode, qrPayload } from "@/lib/app/helpers";
import { useGanli } from "@/lib/app/store";

const TIMES = ["15:00", "15:30", "16:00", "16:30", "17:00"];

export default function ParentPickup() {
  const { data, profile, actions, mode } = useGanli();
  const [who, setWho] = useState("");
  const [time, setTime] = useState("16:00");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  if (!data || !profile) return null;

  const child = data.children.find((c) => c.id === profile.childId) ?? data.children[0];
  const code = pickupCode(child.id);
  const planned = data.pickups.find((p) => p.childId === child.id);
  const chosen = who || planned?.who || (child.authorized[0] ? `${child.authorized[0].name} (${child.authorized[0].relation})` : "");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = await actions.planPickup(child.id, chosen, time);
    setMsg(err ? { ok: false, text: err } : { ok: true, text: `נשמר: ${chosen} אוספ/ת את ${child.name} בסביבות ${time}. הצוות רואה את זה.` });
  };

  return (
    <>
      <PageHead kicker="איסוף" title={`איסוף של ${child.name}`} actions={<Badge tone="ok">קוד תקף להיום</Badge>} />
      <div className="grid-2">
        <Card title="קוד האיסוף להיום">
          <div className="pickup-card">
            <QrCode value={qrPayload(child.id)} label={`קוד QR לאיסוף של ${child.name}`} />
            <div className="pickup-code">
              <span>או לומר לצוות את הקוד</span>
              <b dir="ltr">
                {code.slice(0, 3)} {code.slice(3)}
              </b>
              <small>הקוד מתחדש מדי יום. הצוות מאמת אותו מול הרשימה לפני שהילד יוצא.</small>
            </div>
          </div>
        </Card>

        <Card title="מי אוסף היום?" note="אפשר לשנות עד רגע האיסוף">
          <form className="event-form" onSubmit={save}>
            <fieldset>
              <legend>מורשים לאיסוף</legend>
              <div className="detail-picks">
                {child.authorized.map((a) => {
                  const label = `${a.name} (${a.relation})`;
                  return (
                    <button type="button" key={label} className={chosen === label ? "on" : undefined} aria-pressed={chosen === label} onClick={() => setWho(label)}>
                      <Avatar name={a.name} color="#f6c86e" size={26} /> {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <label>
              שעה משוערת
              <select value={time} onChange={(e) => setTime(e.target.value)} className="plain-select">
                {TIMES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            {msg && (
              <p className={msg.ok ? "form-ok" : "form-error"} role="status">
                {msg.text}
              </p>
            )}
            <button className="btn btn-primary">שמירה</button>
            {planned && !msg && (
              <p className="hint-line">
                כרגע רשום: {planned.who} בסביבות {planned.time}.
              </p>
            )}
          </form>
        </Card>
      </div>
      <Card title="רשימת המורשים">
        <ul className="people">
          {child.authorized.map((a) => (
            <li key={a.name + a.relation}>
              <b>
                {a.name} · {a.relation}
              </b>
              <Badge tone="ok">מורשה איסוף</Badge>
            </li>
          ))}
        </ul>
        <p className="hint-line">להוספת מורשה (למשל שכן או בן משפחה) פנו למנהלת. בקשת שינוי באיסוף אינה מחליפה אישור של הצוות בפועל.</p>
        {mode === "supabase" && <p className="hint-line">במצב שרת, תכנון האיסוף עדיין לא נשמר. הקוד והרשימה עובדים.</p>}
      </Card>
    </>
  );
}
