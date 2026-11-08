"use client";

import { Badge, Card, Empty, PageHead, factTerm, factValue, facts, grid2 } from "@/components/dashboard/ui";
import { shekel } from "@/lib/format";
import { useGanli } from "@/lib/data/GanliProvider";

/** The parent's charges and what is left to pay. */
export default function ParentPayments() {
  const { data, profile } = useGanli();
  if (!data || !profile) return null;
  const charges = data.charges.filter((c) => c.childId === profile.childId);
  const open = charges.reduce((s, c) => s + (c.amount - c.paid), 0);

  return (
    <>
      <PageHead kicker="תשלומים" title="החשבון של המשפחה" />
      <div className={grid2}>
        <Card tint={open ? "var(--mustard-soft)" : "var(--teal-soft)"}>
          <div className="grid gap-1.5">
            <span className="font-heading text-[1rem]/[normal] font-semibold">{open ? "יתרה לתשלום" : "הכל שולם"}</span>
            <b className="font-heading text-[3.375rem]/none font-bold text-cocoa-deep">{shekel(open)}</b>
            <small className="text-[0.9375rem] text-[#6f5d52]">
              {open ? "התשלום מתבצע בהעברה בנקאית. הקבלה תופיע כאן לאחר רישום התשלום." : "תודה! אין חיובים פתוחים."}
            </small>
          </div>
        </Card>
        <Card title="פרטים לתשלום">
          <dl className={facts}>
            <dt className={factTerm}>אמצעי תשלום</dt>
            <dd className={factValue}>העברה בנקאית</dd>
            <dt className={factTerm}>מועד חיוב</dt>
            <dd className={factValue}>ה־10 בכל חודש</dd>
            <dt className={factTerm}>חיוב חודשי</dt>
            <dd className={factValue}>{shekel(1800)}</dd>
          </dl>
        </Card>
      </div>
      <Card title="חיובים">
        {charges.length === 0 ? (
          <Empty>אין חיובים להצגה.</Empty>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>תקופה</th>
                <th>סכום</th>
                <th>שולם</th>
                <th>מועד</th>
                <th>מצב</th>
                <th>מסמך</th>
              </tr>
            </thead>
            <tbody>
              {charges.map((c) => (
                <tr key={c.id}>
                  <td data-label="תקופה">{c.period}</td>
                  <td data-label="סכום">{shekel(c.amount)}</td>
                  <td data-label="שולם">{shekel(c.paid)}</td>
                  <td data-label="מועד">{c.due}</td>
                  <td data-label="מצב">
                    {c.paid >= c.amount ? (
                      <Badge tone="ok">שולם</Badge>
                    ) : c.late ? (
                      <Badge tone="bad">באיחור</Badge>
                    ) : c.paid > 0 ? (
                      <Badge tone="warn">שולם חלקית</Badge>
                    ) : (
                      <Badge tone="warn">פתוח</Badge>
                    )}
                  </td>
                  <td data-label="מסמך">{c.doc || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
}
