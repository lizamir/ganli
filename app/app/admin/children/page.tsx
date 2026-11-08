"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
  Card,
  PageHead,
  grid2,
  hintLine,
  personBadge,
  personDetail,
  personName,
  personRow,
  plainList,
  textInput,
} from "@/components/dashboard/ui";
import { cn } from "@/lib/ui/cn";
import { useGanli } from "@/lib/data/GanliProvider";

const cellPerson = "inline-flex items-center gap-2.5 font-heading text-[1rem]/[normal] font-semibold";

/** All the children and staff. */
export default function AdminChildren() {
  const { data } = useGanli();
  const [q, setQ] = useState("");
  if (!data) return null;
  const list = data.children.filter((c) => !q || c.name.includes(q) || c.parents.includes(q));

  return (
    <>
      <PageHead
        kicker="ילדים ומשפחות"
        title={`${data.children.length} ילדים במשפחתון`}
        actions={
          <input
            className={cn(textInput, "min-w-[260px]")}
            placeholder="חיפוש ילד או הורה"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="חיפוש"
          />
        }
      />
      <div className={grid2}>
        <Card title="ילדים">
          <table className="data-table">
            <thead>
              <tr>
                <th>ילד</th>
                <th>תאריך לידה</th>
                <th>הורים</th>
                <th>היום</th>
                <th>הערות</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td data-label="ילד">
                    <span className={cellPerson}>
                      <Avatar name={c.name} color={c.color} size={32} />
                      {c.name}
                    </span>
                  </td>
                  <td data-label="תאריך לידה">{c.birth}</td>
                  <td data-label="הורים">{c.parents}</td>
                  <td data-label="היום">
                    {c.status === "present" ? (
                      <Badge tone="ok">הגיע/ה {c.arrival}</Badge>
                    ) : (
                      <Badge tone="mute">נעדר/ת</Badge>
                    )}
                  </td>
                  <td data-label="הערות" className="flex flex-wrap gap-1 mobile:justify-between mobile:gap-4">
                    {c.allergy && <Badge tone="bad">אלרגיה: {c.allergy}</Badge>}
                    {c.consentMissing && <Badge tone="warn">חסר אישור צילום</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="צוות והרשאות">
          <ul className={plainList}>
            {data.staff.map((s) => (
              <li key={s.id} className={personRow}>
                <b className={personName}>
                  {s.name} · {s.role}
                </b>
                <span className={cn(personDetail, "flex flex-wrap gap-1")}>
                  {s.perms.map((p) => (
                    <Badge key={p} tone="cool">
                      {p}
                    </Badge>
                  ))}
                </span>
                <Badge tone={s.present ? "ok" : "mute"} className={personBadge}>
                  {s.present ? "במשמרת" : "לא במשמרת"}
                </Badge>
              </li>
            ))}
          </ul>
          <p className={hintLine}>לצוות אין הרשאה לכספים. צוות והורים מצטרפים בהזמנה מהמנהלת.</p>
        </Card>
      </div>
    </>
  );
}
