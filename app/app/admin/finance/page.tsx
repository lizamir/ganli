"use client";

import { useState } from "react";
import { Avatar, Badge, Card, PageHead, shekel } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";

export default function AdminFinance() {
  const { data, actions } = useGanli();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (!data) return null;

  const month = data.charges.filter((c) => c.period === data.currentPeriod);
  const total = month.reduce((s, c) => s + c.amount, 0);
  const received = month.reduce((s, c) => s + c.paid, 0);
  const child = (id: string) => data.children.find((c) => c.id === id)!;

  const record = async (id: string, amount: number) => {
    setBusy(id);
    setError(await actions.recordPayment(id, amount));
    setBusy(null);
  };

  return (
    <>
      <PageHead kicker="כספים" title={`תשלומי ${data.currentPeriod}`} />
      <div className="tiles three">
        <div className="tile" style={{ background: "var(--cocoa)" }}>
          <span>סה״כ לחיוב</span>
          <b>{shekel(total)}</b>
          <em>{month.length} משפחות</em>
        </div>
        <div className="tile" style={{ background: "var(--teal-deep)" }}>
          <span>התקבל</span>
          <b>{shekel(received)}</b>
          <em>{total ? Math.round((received / total) * 100) : 0}% מהחיובים</em>
        </div>
        <div className="tile" style={{ background: "var(--tomato-btn)" }}>
          <span>פתוח</span>
          <b>{shekel(total - received)}</b>
          <em>{month.filter((c) => c.paid < c.amount).length} משפחות</em>
        </div>
      </div>

      <Card title="חיובים ותקבולים" note="תשלום שהתקבל מחוץ לאפליקציה נרשם כאן">
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>ילד</th>
              <th>הורים</th>
              <th>סכום</th>
              <th>שולם</th>
              <th>מועד</th>
              <th>מצב</th>
              <th>מסמך</th>
              <th>
                <span className="sr-only">פעולות</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {month.map((c) => {
              const k = child(c.childId);
              const done = c.paid >= c.amount;
              const late = !done && c.late;
              return (
                <tr key={c.id}>
                  <td data-label="ילד">
                    <span className="cell-person">
                      <Avatar name={k.name} color={k.color} size={30} />
                      {k.name}
                    </span>
                  </td>
                  <td data-label="הורים">{k.parents}</td>
                  <td data-label="סכום">{shekel(c.amount)}</td>
                  <td data-label="שולם">{shekel(c.paid)}</td>
                  <td data-label="מועד">{c.due}</td>
                  <td data-label="מצב">{done ? <Badge tone="ok">שולם</Badge> : late ? <Badge tone="bad">באיחור</Badge> : <Badge tone="warn">ממתין</Badge>}</td>
                  <td data-label="מסמך">{c.doc || "—"}</td>
                  <td>
                    {!done && (
                      <button type="button" className="mini-btn" disabled={busy === c.id} onClick={() => record(c.id, c.amount - c.paid)}>
                        {busy === c.id ? "רושמים…" : "רישום תשלום"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="hint-line">חיוב ותשלום הם רשומות נפרדות. החיבור להפקת חשבוניות עדיין לא נבחר, ולכן מספר המסמך כאן לדוגמה.</p>
      </Card>
    </>
  );
}
