"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { FEATURES } from "@/lib/content";
import { createDemoSnapshot } from "@/lib/app/mock";
import DayRibbon from "./app/DayRibbon";
import Scene from "./app/Scene";
import { Avatar, Badge } from "./app/ui";

type Tab = "parent" | "staff" | "admin";
const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: "parent", label: "הורה", hint: "היום של הילד, בזמן אמת" },
  { id: "staff", label: "צוות", hint: "כל הקבוצה במבט אחד" },
  { id: "admin", label: "מנהלת", hint: "המשפחתון כולו, מסודר" },
];

function Mock({ tab }: { tab: Tab }) {
  const data = useMemo(() => createDemoSnapshot(), []);
  const noa = data.children[0];
  const noaEvents = data.events.filter((e) => e.childId === noa.id);

  if (tab === "parent") {
    return (
      <div className="mock mock-parent">
        <div className="mock-photo">
          <Scene name="sand" label="נועה בארגז חול" />
          <span>התמונה האחרונה · 13:52</span>
        </div>
        <div className="mock-card">
          <header>
            <b>היום של נועה</b>
            <Badge tone="ok" dot>
              בגן עכשיו
            </Badge>
          </header>
          <DayRibbon arrival={noa.arrival} now={data.now} events={noaEvents} />
        </div>
      </div>
    );
  }
  if (tab === "staff") {
    return (
      <div className="mock mock-staff">
        <div className="mock-alert">אלרגיה לאגוזים: יובל. ארוחת ארבע ללא אגוזים</div>
        {data.children.slice(0, 5).map((c) => (
          <div className="mock-row" key={c.id}>
            <Avatar name={c.name} color={c.color} size={34} />
            <b>{c.name}</b>
            <DayRibbon compact arrival={c.arrival} now={data.now} events={data.events.filter((e) => e.childId === c.id)} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="mock mock-admin">
      <div className="mock-tiles">
        <div style={{ background: "var(--teal-deep)" }}>
          <small>נוכחים</small>
          <b>8/10</b>
        </div>
        <div style={{ background: "var(--tomato-btn)" }}>
          <small>צוות</small>
          <b>2/2</b>
        </div>
        <div style={{ background: "var(--mustard)", color: "#3e2a08" }}>
          <small>פניות</small>
          <b>3</b>
        </div>
      </div>
      <div className="mock-card">
        <header>
          <b>תשלומי אוקטובר</b>
          <span>6 מתוך 10 שולמו</span>
        </header>
        <div className="paybar">
          <span style={{ flex: 6, background: "#5fb59a" }} />
          <span style={{ flex: 3, background: "var(--mustard)" }} />
          <span style={{ flex: 1, background: "var(--tomato)" }} />
        </div>
      </div>
    </div>
  );
}

function PickupQr() {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    QRCode.toString("GANLI-DEMO-NOA-4821", { type: "svg", margin: 0, color: { dark: "#3e322b", light: "#0000" } }).then(setSvg);
  }, []);
  return <div className="qr" dangerouslySetInnerHTML={{ __html: svg }} aria-hidden="true" />;
}

function Visual({ id }: { id: (typeof FEATURES)[number]["id"] }) {
  switch (id) {
    case "pickup":
      return (
        <div className="viz viz-pickup" aria-hidden="true">
          <PickupQr />
          <ul>
            <li>
              <Avatar name="ד" color="#f6c86e" size={30} /> דנה · אמא <Badge tone="ok">מורשית</Badge>
            </li>
            <li>
              <Avatar name="ר" color="#9fd8cf" size={30} /> רחל · סבתא <Badge tone="ok">מורשית</Badge>
            </li>
          </ul>
        </div>
      );
    case "menu":
      return (
        <div className="viz viz-menu" aria-hidden="true">
          <div className="dish">
            <span>שני · ארוחת ארבע</span>
            <b>עוגיות שקדים ביתיות</b>
            <Badge tone="bad">מכיל אגוזים</Badge>
          </div>
          <div className="dish safe">
            <span>שלישי · ארוחת ארבע</span>
            <b>יוגורט ופירות</b>
            <Badge tone="ok">מתאים ליובל</Badge>
          </div>
          <div className="dish">
            <span>רביעי · ארוחת בוקר</span>
            <b>קורנפלקס מלא עם חלב</b>
            <Badge tone="warn">חלב · גלוטן</Badge>
          </div>
        </div>
      );
    case "summary":
      return (
        <p className="viz viz-summary" aria-hidden="true">
          “נועה אכלה כמעט הכול, ישנה שעה ורבע וצחקה בארגז החול.”
        </p>
      );
    case "live":
      return (
        <div className="viz viz-live" aria-hidden="true">
          <span>מירב עדכנה: ארוחת צהריים</span>
          <span>נועה התעוררה משינה</span>
          <span>תמונה חדשה באלבום</span>
        </div>
      );
    case "albums":
      return (
        <div className="viz viz-albums" aria-hidden="true">
          <Scene name="paint" label="" />
          <Scene name="blocks" label="" />
          <span className="keep-chip">נשמר באלבום ✓</span>
        </div>
      );
    case "inbox":
      return (
        <div className="viz viz-inbox" aria-hidden="true">
          <p className="bubble in">אאחר באיסוף בעשרים דקות.</p>
          <p className="bubble out">אין בעיה, נחכה לכם 😊</p>
        </div>
      );
    case "money":
      return (
        <div className="viz viz-money" aria-hidden="true">
          <div className="paybar">
            <span style={{ flex: 6, background: "#5fb59a" }} />
            <span style={{ flex: 3, background: "var(--mustard)" }} />
            <span style={{ flex: 1, background: "var(--tomato)" }} />
          </div>
          <small>₪10,800 התקבלו</small>
        </div>
      );
    case "events":
      return (
        <div className="viz viz-events" aria-hidden="true">
          <span className="date-chip">
            <small>דצמ׳</small>
            <b>14</b>
          </span>
          <div>
            <b>מסיבת חנוכה</b>
            <span>מגיעים? ✓ כן · ✕ לא</span>
          </div>
        </div>
      );
  }
}

export default function AppShowcase() {
  const [tab, setTab] = useState<Tab>("parent");
  return (
    <section className="section app-section" id="app" aria-labelledby="app-title">
      <div className="container">
        <div className="app-head reveal">
          <div>
            <p className="eyebrow">
              <b>(04)</b> האפליקציה
            </p>
            <h2 id="app-title" className="title">
              כל היום של הילד,
              <br />
              <span className="serif ink-tomato">בכף היד</span> של ההורה.
            </h2>
          </div>
          <p className="lead">
            חשבונות נפרדים להורים, לצוות ולמנהלת. ההרשאות נאכפות בשרת, כך שכל אחד רואה רק מה שמותר לו.
          </p>
        </div>

        <div className="showcase reveal">
          <div className="showcase-side">
            <div className="showcase-tabs" role="tablist" aria-label="בחירת תפקיד">
              {TABS.map((t) => (
                <button key={t.id} role="tab" aria-selected={tab === t.id} id={`tab-${t.id}`} aria-controls="showcase-panel" onClick={() => setTab(t.id)}>
                  <b>{t.label}</b>
                  <span>{t.hint}</span>
                </button>
              ))}
            </div>
            <Link className="btn btn-primary" href="/login/">
              נסו את הדמו ←
            </Link>
          </div>
          <div className="device" role="tabpanel" id="showcase-panel" aria-labelledby={`tab-${tab}`}>
            <div className="device-bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <small dir="ltr">ganli.co.il/app/{tab}</small>
            </div>
            <Mock tab={tab} />
          </div>
        </div>

        <h3 className="bento-title reveal">ומה עוד בפנים?</h3>
        <div className="bento">
          {FEATURES.map((f, i) => (
            <article key={f.id} className={`bento-item ${f.size} reveal`} style={{ ["--d" as string]: i % 3 }}>
              <Visual id={f.id} />
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
