import { Card, LinkButton, fieldLabel, formMessage, formStack, hintLine, textInput } from "@/components/dashboard/ui";
import { pickupCode } from "@/lib/domain/pickup";
import type { Child } from "@/lib/domain/types";
import { cn } from "@/lib/ui/cn";

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
      <form className={formStack} onSubmit={onVerify}>
        <label className={fieldLabel}>
          הקוד שההורה מציג (6 ספרות)
          <input
            value={code}
            onChange={(e) => onCode(e.target.value)}
            inputMode="numeric"
            autoComplete="off"
            dir="ltr"
            className={cn(textInput, "text-center font-heading text-[1.8rem]/[normal] font-extrabold tracking-[0.3em]")}
            placeholder="000 000"
            maxLength={7}
            aria-describedby="code-help"
          />
        </label>
        <button className="btn btn-primary justify-center">אימות</button>
        <p className={hintLine} id="code-help">
          סריקת QR במצלמה תתווסף בגרסה הבאה. בינתיים מקלידים את הקוד.
          {showDemoHelp && demoChild && (
            <>
              {" "}
              בדמו: <LinkButton onClick={() => onCode(pickupCode(demoChild.id))}>הקוד של {demoChild.name}</LinkButton>
            </>
          )}
        </p>
      </form>
      {msg && (
        <p className={formMessage(msg.ok)} role="status" style={{ marginTop: 12 }}>
          {msg.text}
        </p>
      )}
    </Card>
  );
}
