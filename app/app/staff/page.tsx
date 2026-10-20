"use client";

import { useState } from "react";
import DayRibbon from "@/components/app/DayRibbon";
import EventForm from "@/components/app/EventForm";
import Icon from "@/components/app/Icon";
import { Avatar, Badge, Card, PageHead } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export default function StaffGroup() {
  const { data } = useGanli();
  const [picked, setPicked] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  if (!data) return null;

  const present = data.children.filter((c) => c.status === "present");
  const absent = data.children.filter((c) => c.status === "absent");
  const collected = data.children.filter((c) => c.status === "left");
  const lastFor = (id: string) =>
    data.events
      .filter((e) => e.childId === id)
      .map((e) => e.end ?? e.start)
      .sort()
      .at(-1);
  const staleness = (id: string) => {
    const last = lastFor(id) ?? data.children.find((c) => c.id === id)?.arrival ?? data.now;
    return toMin(data.now) - toMin(last);
  };
  const stale = present.filter((c) => staleness(c.id) >= 120);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <>
      <PageHead
        kicker={`${data.dayLabel} · ${data.now}`}
        title="הקבוצה שלי"
        actions={
          <>
            <Badge tone="cool">
              {present.length} מתוך {data.children.length} נוכחים
            </Badge>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
              <Icon name="plus" size={18} /> עדכון חדש
            </button>
          </>
        }
      />

      <div className="alerts">
        {data.alerts.map((a) => (
          <div key={a.id} className={`alert tone-${a.tone}`} role="alert">
            <Icon name={a.tone === "bad" ? "warn" : "swap"} />
            <span>
              <b>{a.lead}</b> {a.text}
            </span>
          </div>
        ))}
        {stale.length === 0 ? (
          <div className="alert tone-ok">
            <Icon name="check" />
            <span>
              <b>כל הקבוצה מעודכנת.</b> ההורים רואים את היום של הילדים.
            </span>
          </div>
        ) : (
          <div className="alert tone-warn">
            <Icon name="bell" />
            <span>
              <b>אין עדכון שעתיים ומעלה:</b> {stale.map((c) => c.name).join(", ")}
            </span>
          </div>
        )}
      </div>

      <Card title="הילדים היום" note="סמנו כמה ילדים לעדכון קבוצתי">
        <div className="kids-table" role="list">
          <div className="kids-head" aria-hidden="true">
            <span />
            <span>ילד</span>
            <span>היום עד עכשיו</span>
            <span>עדכון אחרון</span>
            <span>מצב</span>
          </div>
          {present.map((c) => {
            const events = data.events.filter((e) => e.childId === c.id);
            const mins = staleness(c.id);
            const isPicked = picked.includes(c.id);
            return (
              <div key={c.id} role="listitem" className={`kid-row${isPicked ? " picked" : ""}`}>
                <input type="checkbox" checked={isPicked} onChange={() => toggle(c.id)} aria-label={`בחירת ${c.name}`} />
                <span className="kid-name">
                  <Avatar name={c.name} color={c.color} size={36} />
                  <b>{c.name}</b>
                </span>
                <DayRibbon compact arrival={c.arrival} now={data.now} events={events} />
                <span className="kid-last">{lastFor(c.id) ?? `הגעה ${c.arrival}`}</span>
                <span>
                  {mins >= 120 ? (
                    <Badge tone="warn">אין עדכון {Math.floor(mins / 60)} שעות</Badge>
                  ) : c.flag ? (
                    <Badge tone={c.flag.tone}>{c.flag.text}</Badge>
                  ) : (
                    <Badge tone="ok">נוכח/ת</Badge>
                  )}
                </span>
              </div>
            );
          })}
          {collected.map((c) => (
            <div key={c.id} role="listitem" className="kid-row absent">
              <span />
              <span className="kid-name">
                <Avatar name={c.name} color={c.color} size={36} dim />
                <b>{c.name}</b>
              </span>
              <span className="kid-last">יצא/ה ב־{c.pickup}</span>
              <span />
              <span>
                <Badge tone="cool">נאסף/ה</Badge>
              </span>
            </div>
          ))}
          {absent.map((c) => (
            <div key={c.id} role="listitem" className="kid-row absent">
              <span />
              <span className="kid-name">
                <Avatar name={c.name} color={c.color} size={36} dim />
                <b>{c.name}</b>
              </span>
              <span className="kid-last">{c.absenceNote}</span>
              <span />
              <span>
                <Badge tone="mute">נעדר/ת</Badge>
              </span>
            </div>
          ))}
        </div>
      </Card>

      {picked.length > 0 && !open && (
        <div className="group-bar" role="toolbar">
          <b>עדכון קבוצתי · {picked.length} ילדים</b>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
            עדכון לנבחרים
          </button>
          <button type="button" className="link-btn light" onClick={() => setPicked([])}>
            ביטול
          </button>
        </div>
      )}

      {open && (
        <div className="drawer-wrap" onClick={() => setOpen(false)}>
          <aside className="drawer" role="dialog" aria-modal="true" aria-label="עדכון יומן" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <h2>עדכון יומן</h2>
              <button type="button" className="link-btn" onClick={() => setOpen(false)} aria-label="סגירה">
                ✕
              </button>
            </div>
            <EventForm
              initialKids={picked}
              onDone={() => {
                setPicked([]);
                setTimeout(() => setOpen(false), 1200);
              }}
            />
          </aside>
        </div>
      )}
    </>
  );
}
