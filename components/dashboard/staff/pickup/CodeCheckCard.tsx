import { Card } from "@/components/dashboard/ui";
import { pickupCode } from "@/lib/domain/pickup";
import type { Child } from "@/lib/domain/types";

type Props = {
  code: string;
  onCode: (code: string) => void;
  onVerify: (e: React.FormEvent) => void;
  demoChild?: Child;
  showDemoHelp: boolean;
  msg: { ok: boolean; text: string } | null;
};

/** Where staff type the code the parent shows. */
export default function CodeCheckCard({ code, onCode, onVerify, demoChild, showDemoHelp, msg }: Props) {
  return (
    <Card title="אימות קוד">
      <form className="event-form" onSubmit={onVerify}>
        <label>
          הקוד שההורה מציג (6 ספרות)
          <input
            value={code}
            onChange={(e) => onCode(e.target.value)}
            inputMode="numeric"
            autoComplete="off"
            dir="ltr"
            className="code-input"
            placeholder="000 000"
            maxLength={7}
            aria-describedby="code-help"
          />
        </label>
        <button className="btn btn-primary">אימות</button>
        <p className="hint-line" id="code-help">
          סריקת QR במצלמה תתווסף בגרסה הבאה. בינתיים מקלידים את הקוד.
          {showDemoHelp && demoChild && (
            <>
              {" "}
              בדמו:{" "}
              <button type="button" className="link-btn" onClick={() => onCode(pickupCode(demoChild.id))}>
                הקוד של {demoChild.name}
              </button>
            </>
          )}
        </p>
      </form>
      {msg && (
        <p className={msg.ok ? "form-ok" : "form-error"} role="status" style={{ marginTop: 12 }}>
          {msg.text}
        </p>
      )}
    </Card>
  );
}
