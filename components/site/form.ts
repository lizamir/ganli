/** Form classes shared by the contact form and the meeting booking on the marketing site. */

/** The cream panel that holds a form. */
export const formPanel =
  "relative z-1 grid [align-content:start] gap-4 rounded-[34px] bg-paper p-10 text-cocoa mobile:px-5 mobile:py-[26px]";
export const formTitle = "text-[1.9rem]";
export const formRow = "grid grid-cols-[1fr_1fr] gap-[14px] mobile:grid-cols-[1fr]";
export const formLabel = "grid gap-[6px] text-[0.95rem] font-bold text-cocoa-deep";
/** Text inputs and selects. */
export const formField =
  "min-h-[52px] rounded-[16px] [border:2px_solid_var(--sand)] bg-cream px-4 py-[14px] [font:400_1.05rem_var(--font-body)] text-cocoa-deep [transition:border-color_0.2s,background_0.2s] focus:border-teal-deep focus:bg-white focus:outline-none";
export const formTextarea = `${formField} min-h-[96px] resize-y`;
export const consentLabel = "flex items-start gap-3 text-[0.95rem] font-medium text-cocoa-deep";
export const consentBox = "mt-[2px] h-[22px] w-[22px] flex-none accent-teal-deep";
/** A .btn inside a form sits a little lower. */
export const formButton = "mt-1";
export const formNote = "text-center text-[0.82rem] text-muted";
