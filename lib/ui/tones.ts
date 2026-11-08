import type { Tone } from "@/lib/domain/types";

/** Background and text color of each status tone. */
export const TONE_CLASS: Record<Tone, string> = {
  ok: "bg-ok-soft text-ok-ink",
  warn: "bg-warn-soft text-warn-ink",
  bad: "bg-bad-soft text-bad-ink",
  cool: "bg-cool-soft text-cool-ink",
  pink: "bg-pink-soft text-pink-ink",
  mute: "bg-mute-soft text-mute-ink",
};
