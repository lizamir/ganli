import type { ReactNode } from "react";

/** The title row at the top of a page in the personal area. */
export default function PageHead({ kicker, title, actions }: { kicker: string; title: string; actions?: ReactNode }) {
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
