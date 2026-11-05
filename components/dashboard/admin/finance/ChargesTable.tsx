import { Avatar, Badge } from "@/components/dashboard/ui";
import { shekel } from "@/lib/format";
import type { Charge, Child } from "@/lib/domain/types";

type Props = {
  month: Charge[];
  child: (id: string) => Child;
  busy: string | null;
  onRecord: (id: string, amount: number) => void;
};

/** One row per family: what was charged, what was paid, and a button to record a payment. */
export default function ChargesTable({ month, child, busy, onRecord }: Props) {
  return (
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
              <td data-label="מצב">
                {done ? (
                  <Badge tone="ok">שולם</Badge>
                ) : late ? (
                  <Badge tone="bad">באיחור</Badge>
                ) : (
                  <Badge tone="warn">ממתין</Badge>
                )}
              </td>
              <td data-label="מסמך">{c.doc || "—"}</td>
              <td>
                {!done && (
                  <button
                    type="button"
                    className="mini-btn"
                    disabled={busy === c.id}
                    onClick={() => onRecord(c.id, c.amount - c.paid)}
                  >
                    {busy === c.id ? "רושמים…" : "רישום תשלום"}
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
