"use client";

import Link from "next/link";
import { useState } from "react";
import DayRibbon from "@/components/app/DayRibbon";
import Scene from "@/components/app/Scene";
import { Badge, Card, Disc, Empty, KIND, PageHead } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";
import { summarizeDay } from "@/lib/app/helpers";
import SignupNotice from "@/components/app/SignupNotice";

export default function ParentToday() {
  const { data, profile, actions } = useGanli();
  const [selected, setSelected] = useState("arrival");
  if (!data || !profile) return null;

  const child = data.children.find((c) => c.id === profile.childId) ?? data.children[0];
  if (!child) return <Empty>אין עדיין ילד מקושר לחשבון.</Empty>;

  const events = data.events.filter((e) => e.childId === child.id).sort((a, b) => a.start.localeCompare(b.start));
  const ev = events.find((e) => e.id === selected);
  const last = events.at(-1);
  const sleepingNow = events.some((e) => e.kind === "sleep" && e.start <= data.now && (!e.end || e.end > data.now));
  const photos = data.photos.filter((p) => p.tags.includes(child.name));
  const notice = data.announcements.find((a) => a.needsRead) ?? data.announcements[0];
  const birthday = child.flag?.tone === "pink";
  const summary = summarizeDay(child, events, data.now);
  const planned = data.pickups.find((p) => p.childId === child.id);

  return (
    <>
      <PageHead
        kicker={data.dayLabel}
        title={`היום של ${child.name}`}
        actions={
          <Badge tone={child.status === "present" ? "ok" : "mute"} dot>
            {child.status === "present" ? (sleepingNow ? "ישנה עכשיו" : "בגן עכשיו") : "לא בגן היום"}
          </Badge>
        }
      />

      <SignupNotice childId={child.id} childName={child.name} />
      <div className="grid-parent">
        <div className="hero-photo">
          <Scene name={birthday ? "party" : photos[0]?.scene ?? "sand"} label={birthday ? "יום הולדת" : photos[0]?.caption} />
          <span className="hero-photo-tag">{birthday ? "יום הולדת שמח 🎂" : `התמונה האחרונה · ${photos[0]?.time ?? ""}`}</span>
          <div className="hero-photo-card">
            <div>
              <b>{birthday ? `${child.name} בת שנה היום!` : photos[0]?.caption}</b>
              <span>
                {data.dayLabel} · עודכן לאחרונה {last?.end ?? last?.start ?? "—"}
              </span>
            </div>
            {birthday && <Badge tone="pink">חוגגים ב־10:30</Badge>}
          </div>
        </div>

        <Card title="איך עובר היום" note="לחצו על הפס לפרטים" className="span-2">
          <DayRibbon arrival={child.arrival} now={data.now} events={events} selectedId={selected} onSelect={setSelected} />
          <div className="ribbon-detail" aria-live="polite">
            {ev ? (
              <>
                <Disc icon={KIND[ev.kind].icon} color={KIND[ev.kind].color} />
                <div>
                  <b>{ev.title}</b>
                  <span>
                    {ev.start}
                    {ev.end ? `–${ev.end}` : ""} · {ev.detail}
                    {ev.by ? ` · עודכן על ידי ${ev.by}` : ""}
                  </span>
                </div>
                {ev.amount != null && (
                  <span className="plate" style={{ "--fill": `${ev.amount * 100}%` } as React.CSSProperties} aria-label={`אכלה ${Math.round(ev.amount * 100)}%`} />
                )}
              </>
            ) : (
              <>
                <Disc icon="foot" color={KIND.arrival.color} />
                <div>
                  <b>הגיעה {child.arrival ?? "—"}</b>
                  <span>איסוף צפוי {child.pickup ?? "—"}</span>
                </div>
              </>
            )}
          </div>
        </Card>

        <div className="stack">
          <Card title="סיכום היום" note="נבנה אוטומטית מהיומן" tint="var(--teal-soft)">
            <p className="summary-text">{summary}</p>
            <div className="row-end" style={{ marginTop: 14 }}>
              <button
                type="button"
                className="mini-btn"
                onClick={() => {
                  const text = `${data.dayLabel} · ${summary}`;
                  if (navigator.share) navigator.share({ text }).catch(() => {});
                  else navigator.clipboard?.writeText(text);
                }}
              >
                שיתוף עם המשפחה
              </button>
              <Link href="/app/parent/pickup/" className="mini-btn">
                {planned ? `איסוף: ${planned.who} · ${planned.time}` : "קוד האיסוף להיום"}
              </Link>
            </div>
          </Card>
        <Card title="מה קרה היום">
          <ul className="timeline-list">
            {[...events].reverse().map((e) => (
              <li key={e.id}>
                <Disc icon={KIND[e.kind].icon} color={KIND[e.kind].color} size={34} />
                <div>
                  <b>{e.title}</b>
                  <span>{e.detail}</span>
                </div>
                <time>{e.end ?? e.start}</time>
              </li>
            ))}
            <li>
              <Disc icon="foot" color={KIND.arrival.color} size={34} />
              <div>
                <b>הגיעה</b>
                <span>נכנסה בחיוך</span>
              </div>
              <time>{child.arrival}</time>
            </li>
            <li className="dim">
              <Disc icon="calendar" color="#cfc3b3" size={34} />
              <div>
                <b>ארוחת ארבע ופעילות</b>
                <span>טרם עודכן</span>
              </div>
              <time>בהמשך</time>
            </li>
          </ul>
        </Card>
        </div>

        <div className="stack">
          {notice && (
            <div className="notice">
              <Disc icon="bell" color="var(--mustard)" />
              <div>
                <b>מהמשפחתון: {notice.title}</b>
                <span>{notice.body}</span>
              </div>
              {notice.needsRead && (
                <button type="button" className="mini-btn" onClick={() => actions.markRead(notice.id)}>
                  קראתי ✓
                </button>
              )}
            </div>
          )}

          <Card title="תמונות מהיום" note={<Link href="/app/parent/photos/">לכל האלבום ←</Link>}>
            <div className="photo-row">
              {photos.slice(0, 3).map((p) => (
                <figure key={p.id}>
                  <Scene name={p.scene} label={p.caption} />
                  <figcaption>{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </Card>

          <Card title="רגע גדול" tint="#efeafb">
            <div className="milestone">
              <span aria-hidden="true">👣</span>
              <div>
                <b>שלושה צעדים לבד!</b>
                <p>{child.name} הלכה מהשטיח עד הספה, וצחקה כל הדרך.</p>
                <small>מירב, 11:05</small>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
