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

/**
 * When an HTML detail panel is open and the user tries to navigate away,
 * shake the panel and highlight Close instead of advancing the journey.
 */
export const PANEL_NUDGE_CONFIG = {
  /** Minimum ms between nudge shakes (wheel spam). */
  debounceMs: 400,
  /** How long Close keeps forced-hover styles. */
  closeHintMs: 900,
  /** Shake travel keyframes (px). */
  shakeOffsets: [0, -10, 10, -7, 7, 0] as const,
  shakeSeconds: 0.42,
} as const;
