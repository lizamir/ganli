import type { ReactNode } from "react";

/** The title row at the top of a page in the personal area. */
export default function PageHead({ kicker, title, actions }: { kicker: string; title: string; actions?: ReactNode }) {
  return (
    <div className="mb-[26px] flex [align-items:end] justify-between gap-5 mobile:flex-col mobile:[align-items:start]">
      <div>
        <p className="text-[0.9375rem] text-subtle">{kicker}</p>
        <h1 className="mt-1 text-[2.5rem] mobile:text-[2rem] small:text-[1.9rem]">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}
