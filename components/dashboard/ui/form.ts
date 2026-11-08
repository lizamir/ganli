// Shared form styles of the personal area and the marketing forms.

/** A label above its field. */
export const fieldLabel = "grid gap-1.5 font-heading text-[0.9375rem]/[1.2] font-medium";

/** A text input or textarea. */
export const textInput =
  "rounded-[14px] border-2 border-solid border-sand bg-paper px-[15px] py-[13px] font-text text-[1.0625rem]/[normal] font-normal text-cocoa-deep focus:border-teal-deep focus:outline-none";

/** A message after a failed action. */
export const formError = "rounded-[12px] bg-bad-soft px-3.5 py-2.5 text-[0.9375rem] text-bad-ink";

/** A message after a successful action. */
export const formOk = "rounded-[12px] bg-ok-soft px-3.5 py-2.5 text-[0.9375rem] text-ok-ink";

/** A success or error message, by `ok`. */
export const formMessage = (ok: boolean) => (ok ? formOk : formError);

/** A form laid out as a column. */
export const formStack = "grid gap-[18px]";

/** A fieldset without the browser's frame. */
export const fieldsetPlain = "m-0 p-0 [border:0]";

/** The title of a group of choices. */
export const legendText = "mb-2.5 font-heading text-[0.9375rem]/[normal] font-semibold";

/** Inputs side by side; stacked on phones. */
export const formRow = "grid grid-cols-[1.4fr_1fr_1fr] gap-3 mobile:grid-cols-[1fr]";

/** A wrapping row of choice chips. */
export const pickRow = "flex flex-wrap gap-2";

/** A choice chip. `withAvatar` makes room for a picture on the reading side. */
export const pickButton = (on: boolean, withAvatar = false) =>
  [
    "inline-flex items-center gap-2 rounded-[999px] border-2 border-solid font-heading text-[0.9375rem]/[normal] font-medium text-cocoa-deep shadow-[0_1px_0_rgba(62,50,43,0.08)]",
    withAvatar ? "py-[5px] pr-3.5 pl-1.5" : "px-4 py-[9px]",
    on ? "border-teal-deep bg-teal-soft" : "border-transparent bg-paper",
  ].join(" ");

/** A select that matches the text inputs. */
export const plainSelect =
  "min-h-12 rounded-[14px] border-2 border-solid border-sand bg-paper px-3.5 py-3 font-text text-[1.05rem]/[normal] font-medium";
