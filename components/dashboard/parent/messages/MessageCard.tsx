import { Card, fieldLabel, formMessage, formStack, rowEnds, textInput } from "@/components/dashboard/ui";

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
      <form className={formStack} onSubmit={onSend}>
        <label className={fieldLabel}>
          מה תרצו לשאול או לעדכן?
          <textarea
            className={textInput}
            value={text}
            onChange={(e) => onText(e.target.value)}
            rows={3}
            placeholder="למשל: אאחר באיסוף בעשר דקות"
          />
        </label>
        {msg && (
          <p className={formMessage(msg.ok)} role="status">
            {msg.text}
          </p>
        )}
        <div className={rowEnds}>
          <button className="btn btn-primary btn-sm justify-center">שליחה</button>
          <button type="button" className="btn btn-ghost btn-sm justify-center" onClick={onAbsence} disabled={absent}>
            {absent ? `${childName} מדווח/ת כנעדר/ת` : `דיווח היעדרות להיום`}
          </button>
        </div>
      </form>
    </Card>
  );
}
