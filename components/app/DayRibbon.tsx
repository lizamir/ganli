"use client";

import type { CareEvent } from "@/lib/app/types";
import { KIND } from "./ui";

// The day strip from the mobile design: 07:00–17:00, one lane per kind,
// a red "now" line, and everything after it shown as "not updated yet".
const DAY_START = 7 * 60;
const DAY_SPAN = 10 * 60;
const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const pos = (t: string) => `${Math.max(0, Math.min(100, ((toMin(t) - DAY_START) / DAY_SPAN) * 100))}%`;
const width = (a: string, b: string) => `${Math.max(1.2, ((toMin(b) - toMin(a)) / DAY_SPAN) * 100)}%`;

const LANES = [
  { key: "arrival", ...KIND.arrival },
  { key: "meal", ...KIND.meal },
  { key: "sleep", ...KIND.sleep },
  { key: "care", ...KIND.care },
] as const;

type Props = {
  arrival?: string;
  pickup?: string;
  now: string;
  events: CareEvent[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  compact?: boolean;
};

export default function DayRibbon({ arrival, now, events, selectedId, onSelect, compact }: Props) {
  const hours = [7, 9, 11, 13, 15, 17];
  return (
    <div className={`ribbon-day${compact ? " compact" : ""}`}>
      {!compact && (
        <div className="rd-hours">
          {hours.map((h) => (
            <span key={h} style={{ insetInlineStart: pos(`${h}:00`) }}>
              {String(h).padStart(2, "0")}:00
            </span>
          ))}
        </div>
      )}
      <div className="rd-lanes">
        {LANES.map((lane) => (
          <div className="rd-lane" key={lane.key} style={{ background: compact ? undefined : lane.tint }}>
            {!compact && <b className="rd-label" style={{ color: lane.ink }}>{lane.label}</b>}
            <div className="rd-track">
              {lane.key === "arrival" && arrival && (
                <button
                  type="button"
                  className={`rd-bar${selectedId === "arrival" ? " on" : ""}`}
                  style={{ insetInlineStart: pos(arrival), width: width(arrival, now), background: lane.color }}
                  onClick={() => onSelect?.("arrival")}
                  aria-label={`הגעה ${arrival}`}
                  tabIndex={onSelect ? 0 : -1}
                />
              )}
              {events
                .filter((e) => e.kind === lane.key)
                .map((e) =>
                  e.end ? (
                    <button
                      type="button"
                      key={e.id}
                      className={`rd-bar${selectedId === e.id ? " on" : ""}`}
                      style={{ insetInlineStart: pos(e.start), width: width(e.start, e.end), background: lane.color }}
                      onClick={() => onSelect?.(e.id)}
                      aria-label={`${e.title} ${e.start}–${e.end}`}
                      tabIndex={onSelect ? 0 : -1}
                    />
                  ) : (
                    <button
                      type="button"
                      key={e.id}
                      className={`rd-dot${selectedId === e.id ? " on" : ""}`}
                      style={{ insetInlineStart: pos(e.start), background: lane.color }}
                      onClick={() => onSelect?.(e.id)}
                      aria-label={`${e.title} ${e.start}`}
                      tabIndex={onSelect ? 0 : -1}
                    />
                  )
                )}
              <span className="rd-future" style={{ insetInlineStart: pos(now) }} />
            </div>
          </div>
        ))}
        <span className="rd-now" style={{ insetInlineStart: compact ? pos(now) : `calc(var(--label) + (100% - var(--label)) * ${(toMin(now) - DAY_START) / DAY_SPAN})` }}>
          {!compact && <em>עכשיו {now}</em>}
        </span>
      </div>
    </div>
  );
}
