"use client";

import { useState } from "react";
import ChargesTable from "@/components/dashboard/admin/finance/ChargesTable";
import {
  Card,
  PageHead,
  formError,
  hintLine,
  tile,
  tileLabel,
  tileNote,
  tileValue,
  tilesGrid,
} from "@/components/dashboard/ui";
import { billedAmount, receivedAmount } from "@/lib/domain/finance";
import { shekel } from "@/lib/format";
import { useGanli } from "@/lib/data/GanliProvider";

/** This month's charges and payments. */
export default function AdminFinance() {
  const { data, actions } = useGanli();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (!data) return null;

  const month = data.charges.filter((c) => c.period === data.currentPeriod);
  const total = billedAmount(month);
  const received = receivedAmount(month);
  const child = (id: string) => data.children.find((c) => c.id === id)!;

  const record = async (id: string, amount: number) => {
    setBusy(id);
    setError(await actions.recordPayment(id, amount));
    setBusy(null);
  };

  return (
    <>
      <PageHead kicker="כספים" title={`תשלומי ${data.currentPeriod}`} />
      <div className={tilesGrid(true)}>
        <div className={tile} style={{ background: "var(--cocoa)" }}>
          <span className={tileLabel}>סה״כ לחיוב</span>
          <b className={tileValue}>{shekel(total)}</b>
          <em className={tileNote}>{month.length} משפחות</em>
        </div>
        <div className={tile} style={{ background: "var(--teal-deep)" }}>
          <span className={tileLabel}>התקבל</span>
          <b className={tileValue}>{shekel(received)}</b>
          <em className={tileNote}>{total ? Math.round((received / total) * 100) : 0}% מהחיובים</em>
        </div>
        <div className={tile} style={{ background: "var(--tomato-btn)" }}>
          <span className={tileLabel}>פתוח</span>
          <b className={tileValue}>{shekel(total - received)}</b>
          <em className={tileNote}>{month.filter((c) => c.paid < c.amount).length} משפחות</em>
        </div>
      </div>

      <Card title="חיובים ותקבולים" note="תשלום שהתקבל מחוץ לאפליקציה נרשם כאן">
        {error && (
          <p className={formError} role="alert">
            {error}
          </p>
        )}
        <ChargesTable month={month} child={child} busy={busy} onRecord={record} />
        <p className={hintLine}>
          חיוב ותשלום הם רשומות נפרדות. החיבור להפקת חשבוניות עדיין לא נבחר, ולכן מספר המסמך כאן לדוגמה.
        </p>
      </Card>
    </>
  );
}
