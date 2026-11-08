// Class names of the list patterns repeated across the personal area.

/** A list without bullets or spacing. */
export const plainList = "m-0 grid list-none p-0";

/** A row separated from the next by a dashed line. */
export const dashedRow = "[border-bottom:1px_dashed_#eadfce] last:[border:0]";

/** Timeline: an event icon, what happened, and the time. */
export const timelineItem = `flex items-center gap-3 py-2.5 ${dashedRow}`;
export const timelineTitle = "font-heading text-[1rem]/[normal] font-semibold";
export const timelineDetail = "text-[0.875rem] text-subtle";
export const timelineTime = "font-heading text-[0.9375rem]/[normal] font-semibold text-subtle";

/** People: a name, a detail line under it, and a status label on the side. */
export const personRow = `grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-0.5 py-3 ${dashedRow}`;
export const personName = "font-heading text-[1rem]/[normal] font-semibold";
export const personDetail = "row-start-2 text-[0.875rem] text-subtle [justify-self:start]";
export const personBadge = "col-start-2 row-[1/span_2] [justify-self:start]";

/** Upcoming events: a date chip, the event, and its label. */
export const eventList = "m-0 grid list-none gap-1 p-0";
export const eventRow = "flex items-center gap-3 py-2";
export const eventTitle = "font-heading text-[1rem]/[normal] font-semibold";
export const eventDetail = "text-[0.875rem] text-subtle";

/** Label and value pairs. */
export const facts = "mx-0 mt-4 mb-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5";
export const factTerm = "font-heading text-[0.9375rem]/[normal] font-semibold text-subtle";
export const factValue = "m-0";

/** A row with its items pushed to both ends. */
export const rowEnds = "flex items-center justify-between";

/** Text-sized override for icons and pictures placed inside small grey text (keeps their old look). */
export const inSmallText = "text-[0.875rem] text-subtle";
