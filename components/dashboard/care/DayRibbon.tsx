"use client";

import { toMinutes } from "@/lib/domain/time";
import type { CareEvent } from "@/lib/domain/types";
import { KIND } from "@/components/dashboard/care/careKinds";
import { cn } from "@/lib/ui/cn";

// The day strip from the mobile design: 07:00–17:00, one lane per kind,
// a red "now" line, and everything after it shown as "not updated yet".
const DAY_START = 7 * 60;
const DAY_SPAN = 10 * 60;
/** Where a time falls on the strip, as a percentage. */
const pos = (t: string) => `${Math.max(0, Math.min(100, ((toMinutes(t) - DAY_START) / DAY_SPAN) * 100))}%`;
/** How wide an event is on the strip, as a percentage. */
const width = (a: string, b: string) => `${Math.max(1.2, ((toMinutes(b) - toMinutes(a)) / DAY_SPAN) * 100)}%`;

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
  className?: string;
};

/** The child's day as a horizontal strip of colored events. `compact` is the small version for the group board. */
// Positions come from inline styles; these classes only shape the pieces.
const hoursRow = "relative ms-(--label) h-[22px] [font:500_0.75rem_var(--font-display)] text-subtle";
const hourMark = "absolute [transform:translateX(50%)] mobile:even:hidden";
const laneBase = "grid items-center";
const laneFull = "min-h-[34px] grid-cols-[var(--label)_1fr] rounded-[12px]";
const laneCompact = "min-h-0 grid-cols-[1fr] rounded-[4px] bg-[#f3ece2]";
const laneLabel = "ps-[12px] [font:600_0.875rem_var(--font-display)]";
const marker =
  "absolute top-1/2 cursor-pointer [border:0] p-0 [transform:translateY(-50%)] [transition:box-shadow_0.2s,transform_0.2s]";
const bar = (compact?: boolean) => cn(marker, compact ? "h-[7px] rounded-[4px]" : "h-[18px] rounded-[9px]");
const dot = (compact?: boolean) =>
  cn(marker, "rounded-[50%]", compact ? "ms-[-3px] h-[7px] w-[7px]" : "ms-[-8px] h-[16px] w-[16px]");
const selected = "[box-shadow:0_0_0_3px_#fff,0_0_0_5px_var(--cocoa-deep)]";
const future = "pointer-events-none absolute end-0";
const futureFull =
  "top-[4px] bottom-[4px] rounded-[8px] [background:repeating-linear-gradient(-45deg,rgba(255,255,255,0.75)_0_6px,rgba(255,255,255,0.35)_6px_12px)]";
const futureCompact = "top-0 bottom-0 rounded-[4px] [background:rgba(243,236,226,0.85)]";
const nowLine = "pointer-events-none absolute w-[2px] bg-tomato";
const nowTag =
  "absolute bottom-full mb-[4px] rounded-[8px] bg-tomato-ink px-[8px] py-[3px] [font:600_0.75rem_var(--font-display)] whitespace-nowrap text-white not-italic [transform:translateX(50%)] mobile:top-full mobile:bottom-auto mobile:[margin:4px_0_0]";

export default function DayRibbon({ arrival, now, events, selectedId, onSelect, compact, className }: Props) {
  const hours = [7, 9, 11, 13, 15, 17];
  return (
    <div className={cn("relative [--label:76px] mobile:[--label:56px]", !compact && "mobile:pb-[26px]", className)}>
      {!compact && (
        <div className={hoursRow}>
          {hours.map((h) => (
            <span key={h} className={hourMark} style={{ insetInlineStart: pos(`${h}:00`) }}>
              {String(h).padStart(2, "0")}:00
            </span>
          ))}
        </div>
      )}
      <div className={cn("relative grid", compact ? "gap-[2px]" : "gap-[6px]")}>
        {LANES.map((lane) => (
          <div
            className={cn(laneBase, compact ? laneCompact : laneFull)}
            key={lane.key}
            style={{ background: compact ? undefined : lane.tint }}
          >
            {!compact && (
              <b className={laneLabel} style={{ color: lane.ink }}>
                {lane.label}
              </b>
            )}
            <div className={cn("relative", compact ? "h-[7px]" : "h-[34px]")}>
              {lane.key === "arrival" && arrival && (
                <button
                  type="button"
                  className={cn(bar(compact), selectedId === "arrival" && selected)}
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
                      className={cn(bar(compact), selectedId === e.id && selected)}
                      style={{ insetInlineStart: pos(e.start), width: width(e.start, e.end), background: lane.color }}
                      onClick={() => onSelect?.(e.id)}
                      aria-label={`${e.title} ${e.start}–${e.end}`}
                      tabIndex={onSelect ? 0 : -1}
                    />
                  ) : (
                    <button
                      type="button"
                      key={e.id}
                      className={cn(dot(compact), selectedId === e.id && selected)}
                      style={{ insetInlineStart: pos(e.start), background: lane.color }}
                      onClick={() => onSelect?.(e.id)}
                      aria-label={`${e.title} ${e.start}`}
                      tabIndex={onSelect ? 0 : -1}
                    />
                  ),
                )}
              <span
                className={cn(future, compact ? futureCompact : futureFull)}
                style={{ insetInlineStart: pos(now) }}
              />
            </div>
          </div>
        ))}
        <span
          className={cn(nowLine, compact ? "top-[-2px] bottom-[-2px]" : "top-[-4px] bottom-[-4px]")}
          style={{
            insetInlineStart: compact
              ? pos(now)
              : `calc(var(--label) + (100% - var(--label)) * ${(toMinutes(now) - DAY_START) / DAY_SPAN})`,
          }}
        >
          {!compact && <em className={nowTag}>עכשיו {now}</em>}
        </span>
      </div>
    </div>
  );
}
