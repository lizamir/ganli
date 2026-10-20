import type { ReactNode } from "react";
import type { Tone } from "@/lib/app/types";
import Icon, { type IconName } from "./Icon";

export function Card({ title, note, children, className = "", tint }: { title?: string; note?: ReactNode; children: ReactNode; className?: string; tint?: string }) {
  return (
    <section className={`dcard ${className}`} style={tint ? { background: tint } : undefined}>
      {title && (
        <header className="dcard-head">
          <h2>{title}</h2>
          {note && <span>{note}</span>}
        </header>
      )}
      {children}
    </section>
  );
}

export function Badge({ tone = "mute", children, dot }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span className={`badge tone-${tone}`}>
      {dot && <i />}
      {children}
    </span>
  );
}

export function Avatar({ name, color, size = 40, dim }: { name: string; color: string; size?: number; dim?: boolean }) {
  return (
    <span className="avatar" style={{ width: size, height: size, background: dim ? "#e7ded2" : color, fontSize: size * 0.42 }}>
      {name[0]}
    </span>
  );
}

export function Disc({ icon, color, size = 38 }: { icon: IconName; color: string; size?: number }) {
  return (
    <span className="disc" style={{ width: size, height: size, background: color }}>
      <Icon name={icon} size={size * 0.5} />
    </span>
  );
}

export function PageHead({ kicker, title, actions }: { kicker: string; title: string; actions?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <p>{kicker}</p>
        <h1>{title}</h1>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}

// `color` is for fills (bars, dots, icon discs); `ink` is the darker twin used for text on the tint.
export const KIND = {
  arrival: { color: "#2e9ea0", ink: "#17595b", tint: "#dcefee", icon: "foot" as IconName, label: "נוכחות" },
  meal: { color: "#e39a2d", ink: "#7a4a00", tint: "#fbecd2", icon: "meal" as IconName, label: "אוכל" },
  sleep: { color: "#6b5fb5", ink: "#473d8f", tint: "#ebe8f8", icon: "sleep" as IconName, label: "שינה" },
  care: { color: "#e07a6a", ink: "#9a3526", tint: "#fbe3de", icon: "care" as IconName, label: "טיפול" },
};

export const shekel = (n: number) => `₪${n.toLocaleString("he-IL")}`;
