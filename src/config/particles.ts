import { COLORS } from "@config/colors";
import type { TextureAssetKey } from "@config/assets";

export interface ParticleLayerConfig {
  textureKey: TextureAssetKey;
  count: number;
  reducedMotionCount: number;
  size: number;
  opacity: number;
  color: string;
  seed: number;
}

/**
 * Ambient dust / sparkle field. Every Kenney particle sprite we kept
 * gets its own layer so the corridor feels populated end-to-end.
 */
export const PARTICLES_CONFIG = {
  /** World-space half-extents of the particle volume. */
  spreadX: 32,
  spreadY: 18,
  /** Deep enough to cover explore camera → contact card (~z −29). */
  spreadZ: 44,
  /** Shift volume toward corridor mid-depth so the far end is filled. */
  origin: [0, 0.4, -10] as [number, number, number],
  rotationYSpeed: 0.018,
  rotationXSpeed: 0.006,
  layers: [
    {
      textureKey: "particleGlow",
      count: 420,
      reducedMotionCount: 90,
      size: 0.26,
      opacity: 0.42,
      color: COLORS.cyan,
      seed: 1,
    },
    {
      textureKey: "glowSoft",
      count: 260,
      reducedMotionCount: 56,
      size: 0.34,
      opacity: 0.28,
      color: COLORS.electricBlue,
      seed: 2,
    },
    {
      textureKey: "particleCircle",
      count: 180,
      reducedMotionCount: 40,
      size: 0.2,
      opacity: 0.38,
      color: COLORS.purple,
      seed: 3,
    },
    {
      textureKey: "particleStar",
      count: 160,
      reducedMotionCount: 36,
      size: 0.14,
      opacity: 0.62,
      color: COLORS.white,
      seed: 4,
    },
    {
      textureKey: "particleSpark",
      count: 120,
      reducedMotionCount: 28,
      size: 0.11,
      opacity: 0.55,
      color: COLORS.electricBlue,
      seed: 5,
    },
    {
      textureKey: "particleFlare",
      count: 70,
      reducedMotionCount: 16,
      size: 0.42,
      opacity: 0.22,
      color: COLORS.cyan,
      seed: 6,
    },
  ] as const satisfies readonly ParticleLayerConfig[],
} as const;
