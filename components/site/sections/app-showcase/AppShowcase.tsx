"use client";

import Link from "next/link";
import { useState } from "react";
import { FEATURES } from "@/content";
import FeatureVisual from "./FeatureVisual";
import RoleMock, { type Tab } from "./RoleMock";

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: "parent", label: "הורה", hint: "היום של הילד, בזמן אמת" },
  { id: "staff", label: "צוות", hint: "כל הקבוצה במבט אחד" },
  { id: "admin", label: "מנהלת", hint: "המשפחתון כולו, מסודר" },
];

/** The app section of the marketing site: a preview per role and a grid of features. */
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
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  id={`tab-${t.id}`}
                  aria-controls="showcase-panel"
                  onClick={() => setTab(t.id)}
                >
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
            <RoleMock tab={tab} />
          </div>
        </div>

        <h3 className="bento-title reveal">ומה עוד בפנים?</h3>
        <div className="bento">
          {FEATURES.map((f, i) => (
            <article key={f.id} className={`bento-item ${f.size} reveal`} style={{ ["--d" as string]: i % 3 }}>
              <FeatureVisual id={f.id} />
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
