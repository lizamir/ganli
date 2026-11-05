"use client";

import { useState } from "react";
import SignupNotice from "@/components/dashboard/care/SignupNotice";
import DayStripCard from "@/components/dashboard/parent/today/DayStripCard";
import MomentCard from "@/components/dashboard/parent/today/MomentCard";
import NoticeBanner from "@/components/dashboard/parent/today/NoticeBanner";
import PhotosCard from "@/components/dashboard/parent/today/PhotosCard";
import SummaryCard from "@/components/dashboard/parent/today/SummaryCard";
import TimelineCard from "@/components/dashboard/parent/today/TimelineCard";
import TodayPhoto from "@/components/dashboard/parent/today/TodayPhoto";
import { Badge, Empty, PageHead } from "@/components/dashboard/ui";
import { useGanli } from "@/lib/data/GanliProvider";
import { summarizeDay } from "@/lib/domain/daySummary";

/** The parent's home: their child's day so far. */
export default function ParentToday() {
  const { data, profile, actions } = useGanli();
  const [selected, setSelected] = useState("arrival");
  if (!data || !profile) return null;

  const child = data.children.find((c) => c.id === profile.childId) ?? data.children[0];
  if (!child) return <Empty>אין עדיין ילד מקושר לחשבון.</Empty>;

  const events = data.events.filter((e) => e.childId === child.id).sort((a, b) => a.start.localeCompare(b.start));
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
        <TodayPhoto child={child} photo={photos[0]} last={last} dayLabel={data.dayLabel} birthday={birthday} />
        <DayStripCard child={child} events={events} now={data.now} selected={selected} onSelect={setSelected} />

        <div className="stack">
          <SummaryCard summary={summary} dayLabel={data.dayLabel} planned={planned} />
          <TimelineCard child={child} events={events} />
        </div>

        <div className="stack">
          {notice && <NoticeBanner notice={notice} onRead={actions.markRead} />}
          <PhotosCard photos={photos} />
          <MomentCard childName={child.name} />
        </div>
      </div>
    </>
  );
}
