import { Card } from "@/components/dashboard/ui";

type Props = {
  text: string;
  onText: (text: string) => void;
  onSend: (e: React.FormEvent) => void;
  onAbsence: () => void;
  absent: boolean;
  childName: string;
  msg: { ok: boolean; text: string } | null;
};

/** Send the director a message, or report the child absent today. */
export default function MessageCard({ text, onText, onSend, onAbsence, absent, childName, msg }: Props) {
  return (
    <Card title="שליחת הודעה למנהלת">
      <form className="event-form" onSubmit={onSend}>
        <label>
          מה תרצו לשאול או לעדכן?
          <textarea
            value={text}
            onChange={(e) => onText(e.target.value)}
            rows={3}
            placeholder="למשל: אאחר באיסוף בעשר דקות"
          />
        </label>
        {msg && (
          <p className={msg.ok ? "form-ok" : "form-error"} role="status">
            {msg.text}
          </p>
        )}
        <div className="row-end">
          <button className="btn btn-primary btn-sm">שליחה</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onAbsence} disabled={absent}>
            {absent ? `${childName} מדווח/ת כנעדר/ת` : `דיווח היעדרות להיום`}
          </button>
        </div>
      </form>
    </Card>
  );
}
