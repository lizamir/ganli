import type { MutableRefObject } from "react";

export const COLORS = {
  wood: "#d9c3a3",
  grain: "#b0916b",
  cocoa: "#6b5a4f",
  teal: "#2e9ea0",
  tomato: "#eb5a3b",
  blush: "#f3a59b",
  mustard: "#eaa23a",
};

export const DEPTH = 0.9;
export const DROP_HEIGHT = 7;
export const BLOCK_COUNT = 13;

/** Phones and tablets: fewer pixels and no shadow map, so scrolling stays smooth next to the canvas. */
export const LITE = typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches;

/** Scroll progress (0..1) reported by the page; when given, blocks are placed by scroll, not by time. */
export type Progress = MutableRefObject<number>;
