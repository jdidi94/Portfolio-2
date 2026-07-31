/**
 * Depth navigation — scroll and empty-space clicks along section bands.
 * Wheel steps between sections (not every card); click focuses individuals.
 */
export const NAVIGATION_CONFIG = {
  /** Minimum time between wheel depth steps (ms). Slightly longer for deep jumps. */
  wheelCooldownMs: 620,
  /** Ignore tiny trackpad noise below this |deltaY|. */
  wheelThreshold: 12,
} as const;
