import { COLORS } from "@config/colors";

/**
 * Corridor depth haze — current section stays readable;
 * deeper bands dissolve into shapes + neon until you travel there.
 */
export const FOG_CONFIG = {
  color: COLORS.black,
  /**
   * Distance past the camera→lookAt focus before haze begins.
   * ~⅓–½ of a section gap so the active band stays clear.
   */
  clearPadding: 5.5,
  /** Extra clear distance while a card is focused for reading. */
  focusClearBoost: 3.2,
  /**
   * Depth span from near→far fog. ≈ one section gap so the next
   * band is fully veiled until the camera approaches.
   */
  hazeDepth: 13.5,
  /** Soft damp for near/far as the camera travels (higher = snappier). */
  dampLambda: 3.4,
  nearMin: 3.5,
  farMax: 72,
} as const;
