"use client";

import { useState } from "react";
import { Avatar, Badge, Card, PageHead } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";

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
        actions={<input className="search" placeholder="חיפוש ילד או הורה" value={q} onChange={(e) => setQ(e.target.value)} aria-label="חיפוש" />}
      />
      <div className="grid-2">
        <Card title="ילדים">
          <table className="table">
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
                    <span className="cell-person">
                      <Avatar name={c.name} color={c.color} size={32} />
                      {c.name}
                    </span>
                  </td>
                  <td data-label="תאריך לידה">{c.birth}</td>
                  <td data-label="הורים">{c.parents}</td>
                  <td data-label="היום">{c.status === "present" ? <Badge tone="ok">הגיע/ה {c.arrival}</Badge> : <Badge tone="mute">נעדר/ת</Badge>}</td>
                  <td data-label="הערות" className="cell-tags">
                    {c.allergy && <Badge tone="bad">אלרגיה: {c.allergy}</Badge>}
                    {c.consentMissing && <Badge tone="warn">חסר אישור צילום</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="צוות והרשאות">
          <ul className="people">
            {data.staff.map((s) => (
              <li key={s.id}>
                <b>
                  {s.name} · {s.role}
                </b>
                <span className="perm-list">
                  {s.perms.map((p) => (
                    <Badge key={p} tone="cool">
                      {p}
                    </Badge>
                  ))}
                </span>
                <Badge tone={s.present ? "ok" : "mute"}>{s.present ? "במשמרת" : "לא במשמרת"}</Badge>
              </li>
            ))}
          </ul>
          <p className="hint-line">לצוות אין הרשאה לכספים. צוות והורים מצטרפים בהזמנה מהמנהלת.</p>
        </Card>
      </div>
    </>
  );
}
