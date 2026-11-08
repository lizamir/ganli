// The colored number tiles at the top of the director's pages.

/** The row of tiles: four, or three with `three`. Two per row on smaller screens. */
export const tilesGrid = (three = false) =>
  `mb-5 grid gap-4 narrow:grid-cols-[repeat(2,1fr)] mobile:grid-cols-[repeat(2,1fr)] small:gap-2.5 ${three ? "grid-cols-[repeat(3,1fr)]" : "grid-cols-[repeat(4,1fr)]"}`;

export const tile =
  "grid min-h-[140px] content-between gap-1.5 rounded-[24px] px-[22px] py-5 text-white small:min-h-[110px] small:p-4";
export const tileLabel = "font-heading text-[0.9375rem]/[normal] font-semibold";
export const tileValue = "font-heading text-[2.875rem]/none font-bold small:text-[2.2rem]";
export const tileValueSmall = "text-[1.125rem] font-medium";
export const tileNote = "text-[0.875rem] not-italic";
