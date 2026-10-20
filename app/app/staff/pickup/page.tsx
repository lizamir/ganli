"use client";

import { useState } from "react";
import { Avatar, Badge, Card, PageHead } from "@/components/app/ui";
import { pickupCode } from "@/lib/app/helpers";
import { useGanli } from "@/lib/app/store";
import type { Child } from "@/lib/app/types";

export default function StaffPickup() {
  const { data, actions, mode } = useGanli();
  const [code, setCode] = useState("");
  const [found, setFound] = useState<Child | null>(null);
  const [who, setWho] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  if (!data) return null;

  const present = data.children.filter((c) => c.status === "present");
  const left = data.children.filter((c) => c.status === "left");
  const demoChild = present[0];

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.replace(/\D/g, "");
    const child = present.find((c) => pickupCode(c.id) === clean);
    setMsg(null);
    setWho("");
    if (!child) {
      setFound(null);
      setMsg({ ok: false, text: "הקוד לא תקין או לא בתוקף להיום. בקשו מההורה להציג את הקוד העדכני, ואמתו מול רשימת המורשים." });
      return;
    }
    setFound(child);
  };

  const planned = found ? data.pickups.find((p) => p.childId === found.id) : undefined;
  const chosen = who || (found?.authorized[0] ? `${found.authorized[0].name} (${found.authorized[0].relation})` : "");

  const checkOut = async (child: Child, by: string) => {
    const err = await actions.checkOut(child.id, by);
    setMsg(err ? { ok: false, text: err } : { ok: true, text: `${child.name} נאסף/ה על ידי ${by}. היציאה נרשמה ב־${data.now}.` });
    if (!err) {
      setFound(null);
      setCode("");
    }
  };

  return (
    <>
      <PageHead kicker="איסוף" title="אימות איסוף" actions={<Badge tone="cool">{left.length} נאספו היום</Badge>} />
      <div className="grid-2">
        <Card title="אימות קוד">
          <form className="event-form" onSubmit={verify}>
            <label>
              הקוד שההורה מציג (6 ספרות)
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                autoComplete="off"
                dir="ltr"
                className="code-input"
                placeholder="000 000"
                maxLength={7}
                aria-describedby="code-help"
              />
            </label>
            <button className="btn btn-primary">אימות</button>
            <p className="hint-line" id="code-help">
              סריקת QR במצלמה תתווסף בגרסה הבאה. בינתיים מקלידים את הקוד.
              {mode === "demo" && demoChild && (
                <>
                  {" "}
                  בדמו: <button type="button" className="link-btn" onClick={() => setCode(pickupCode(demoChild.id))}>הקוד של {demoChild.name}</button>
                </>
              )}
            </p>
          </form>
          {msg && (
            <p className={msg.ok ? "form-ok" : "form-error"} role="status" style={{ marginTop: 12 }}>
              {msg.text}
            </p>
          )}
        </Card>

        <Card title={found ? "הקוד אומת" : "מי מחכה לאיסוף"} note={found ? undefined : "לפי תכנון ההורים"}>
          {found ? (
            <div className="verify">
              <div className="child-hero">
                <Avatar name={found.name} color={found.color} size={64} />
                <div>
                  <b>{found.name}</b>
                  <span>{planned ? `מתוכנן: ${planned.who} בסביבות ${planned.time}` : "לא תוכנן איסוף מראש"}</span>
                </div>
              </div>
              <fieldset>
                <legend>מי אוסף עכשיו? (רק מורשים)</legend>
                <div className="detail-picks">
                  {found.authorized.map((a) => {
                    const label = `${a.name} (${a.relation})`;
                    return (
                      <button type="button" key={label} className={chosen === label ? "on" : undefined} aria-pressed={chosen === label} onClick={() => setWho(label)}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <button type="button" className="btn btn-primary" onClick={() => checkOut(found, chosen)}>
                רישום יציאה
              </button>
              <p className="hint-line">מי שלא ברשימה אינו מורשה. אם הגיע אדם אחר, צרו קשר עם ההורים או עם המנהלת לפני שהילד יוצא.</p>
            </div>
          ) : (
            <ul className="people">
              {present.map((c) => {
                const p = data.pickups.find((x) => x.childId === c.id);
                return (
                  <li key={c.id}>
                    <b>{c.name}</b>
                    <span>{p ? `${p.who} · ${p.time}` : "לא תוכנן"}</span>
                    {p ? <Badge tone="cool">מתוכנן</Badge> : <Badge tone="mute">רגיל</Badge>}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {left.length > 0 && (
        <Card title="נאספו היום">
          <ul className="people">
            {left.map((c) => (
              <li key={c.id}>
                <b>{c.name}</b>
                <span>יצא/ה ב־{c.pickup}</span>
                <Badge tone="ok">נאסף/ה</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
