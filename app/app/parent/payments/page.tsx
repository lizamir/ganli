"use client";

import { Badge, Card, Empty, PageHead, shekel } from "@/components/app/ui";
import { useGanli } from "@/lib/app/store";

export default function ParentPayments() {
  const { data, profile } = useGanli();
  if (!data || !profile) return null;
  const charges = data.charges.filter((c) => c.childId === profile.childId);
  const open = charges.reduce((s, c) => s + (c.amount - c.paid), 0);

  return (
    <>
      <PageHead kicker="תשלומים" title="החשבון של המשפחה" />
      <div className="grid-2">
        <Card tint={open ? "var(--mustard-soft)" : "var(--teal-soft)"}>
          <div className="big-number">
            <span>{open ? "יתרה לתשלום" : "הכל שולם"}</span>
            <b>{shekel(open)}</b>
            <small>{open ? "התשלום מתבצע בהעברה בנקאית. הקבלה תופיע כאן לאחר רישום התשלום." : "תודה! אין חיובים פתוחים."}</small>
          </div>
        </Card>
        <Card title="פרטים לתשלום">
          <dl className="facts">
            <dt>אמצעי תשלום</dt>
            <dd>העברה בנקאית</dd>
            <dt>מועד חיוב</dt>
            <dd>ה־10 בכל חודש</dd>
            <dt>חיוב חודשי</dt>
            <dd>{shekel(1800)}</dd>
          </dl>
        </Card>
      </div>
      <Card title="חיובים">
        {charges.length === 0 ? (
          <Empty>אין חיובים להצגה.</Empty>
        ) : (
          <table className="table">
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
                    {c.paid >= c.amount ? <Badge tone="ok">שולם</Badge> : c.late ? <Badge tone="bad">באיחור</Badge> : c.paid > 0 ? <Badge tone="warn">שולם חלקית</Badge> : <Badge tone="warn">פתוח</Badge>}
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
