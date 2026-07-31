/**
 * Soft blurry neon outer-glow on hex cards (hover).
 * Live-tunable params live in CardEdgeFogTuningParams (dev panel).
 */
export interface CardEdgeFogTuningParams {
  /** Canvas blur radius in px — primary soft/edgy control. */
  blurPx: number;
  /** Hex clear radius (fraction of half-texture). */
  hexClear: number;
  /** Soft band width outside the hex. */
  softBand: number;
  /** Circular outer fade start / end. */
  circleFadeStart: number;
  circleFadeEnd: number;
  /** Plane scale vs hex face radius. */
  planeScale: number;
  /** Aura material opacity. */
  opacity: number;
  /** Model-local Z behind the front lip. */
  zOffset: number;
  /** Extra emissive on glass frame while hovering. */
  frameEmissiveBoost: number;
  /** skillBadge frame boost. */
  skillBadgeFrameBoost: number;
}

export const CARD_EDGE_FOG_TUNING_DEFAULTS: CardEdgeFogTuningParams = {
  blurPx: 40,
  hexClear: 0.3,
  softBand: 0.24,
  circleFadeStart: 0.2,
  circleFadeEnd: 0.5,
  planeScale: 2.5,
  opacity: 0.9,
  zOffset: 0.02,
  frameEmissiveBoost: 1,
  skillBadgeFrameBoost: 1,
};

/** Static defaults used when the tuning store is not mounted. */
export const CARD_EDGE_FOG = {
  textureSize: 512,
  ...CARD_EDGE_FOG_TUNING_DEFAULTS,
} as const;

export type CardEdgeFogConfig = typeof CARD_EDGE_FOG;

export function formatCardEdgeFogLog(
  params: CardEdgeFogTuningParams,
): string {
  return [
    "[CardEdgeFogTuning] paste into CARD_EDGE_FOG_TUNING_DEFAULTS:",
    JSON.stringify(params, null, 2),
  ].join("\n");
}
