import { Avatar } from "@/components/dashboard/ui";
import { authorizedLabel } from "@/lib/domain/pickup";
import type { Child, PlannedPickup } from "@/lib/domain/types";

type Props = {
  child: Child;
  planned?: PlannedPickup;
  chosen: string;
  onChoose: (who: string) => void;
  onCheckOut: () => void;
};

/** After a good code: who is allowed to collect the child, and the button that records the exit. */
export default function VerifyPanel({ child, planned, chosen, onChoose, onCheckOut }: Props) {
  return (
    <div className="verify">
      <div className="child-hero">
        <Avatar name={child.name} color={child.color} size={64} />
        <div>
          <b>{child.name}</b>
          <span>{planned ? `מתוכנן: ${planned.who} בסביבות ${planned.time}` : "לא תוכנן איסוף מראש"}</span>
        </div>
      </div>
      <fieldset>
        <legend>מי אוסף עכשיו? (רק מורשים)</legend>
        <div className="detail-picks">
          {child.authorized.map((a) => {
            const label = authorizedLabel(a);
            return (
              <button
                type="button"
                key={label}
                className={chosen === label ? "on" : undefined}
                aria-pressed={chosen === label}
                onClick={() => onChoose(label)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <button type="button" className="btn btn-primary" onClick={onCheckOut}>
        רישום יציאה
      </button>
      <p className="hint-line">
        מי שלא ברשימה אינו מורשה. אם הגיע אדם אחר, צרו קשר עם ההורים או עם המנהלת לפני שהילד יוצא.
      </p>
    </div>
  );
}
