import type { ViewportTier } from "@config/viewport";

/**
 * Runtime quality tiers for the 3D experience.
 * Starts high; PerformanceMonitor can step down under load.
 */
export type PerformanceQuality = "high" | "balanced" | "low";

export interface PerformanceQualityProfile {
  /** Multiplier on ambient particle layer counts. */
  particleScale: number;
  enableDof: boolean;
  enableNoise: boolean;
  /** Scales the viewport-tier dprMax when the monitor reports this quality. */
  dprScale: number;
  antialias: boolean;
}

/**
 * Adaptive quality + draw-call savings.
 * Tunables live here — never hardcode in the render loop.
 */
export const PERFORMANCE_CONFIG = {
  defaultQuality: "high" as PerformanceQuality,
  monitor: {
    /** Samples before a rise/fall decision. */
    iterations: 8,
    ms: 280,
    threshold: 0.7,
    step: 0.12,
    /** After this many flips, lock to the fallback profile. */
    flipflops: 4,
    /**
     * FPS band relative to the detected refresh rate.
     * Below lower → decline; above upper → incline.
     */
    bounds: (refreshrate: number): [number, number] =>
      refreshrate > 100 ? [52, 88] : [38, 55],
  },
  quality: {
    high: {
      particleScale: 1,
      enableDof: true,
      enableNoise: true,
      dprScale: 1,
      antialias: true,
    },
    balanced: {
      particleScale: 0.55,
      enableDof: false,
      enableNoise: true,
      dprScale: 0.85,
      antialias: true,
    },
    low: {
      particleScale: 0.28,
      enableDof: false,
      enableNoise: false,
      dprScale: 0.65,
      antialias: false,
    },
  } satisfies Record<PerformanceQuality, PerformanceQualityProfile>,
  /** Extra particle density cut by viewport (on top of quality). */
  tierParticleScale: {
    desktop: 1,
    mid: 0.62,
    small: 0.38,
  } satisfies Record<ViewportTier, number>,
  /**
   * DoF is expensive (depth pass). Keep it for desktop high quality only;
   * corridor fog still veils distant bands on mid/small.
   */
  dofMinTier: "desktop" as ViewportTier,
  /**
   * Hide section groups when |lookAt.z − centerZ| exceeds this (world units).
   * ~2 section gaps so the next band stays mounted for travel.
   */
  sectionVisibleMargin: 32,
  /** Map PerformanceMonitor factor (0–1) → discrete quality. */
  qualityFromFactor: (factor: number): PerformanceQuality => {
    if (factor >= 0.72) return "high";
    if (factor >= 0.38) return "balanced";
    return "low";
  },
} as const;

export function resolveParticleScale(
  quality: PerformanceQuality,
  tier: ViewportTier,
): number {
  return (
    PERFORMANCE_CONFIG.quality[quality].particleScale *
    PERFORMANCE_CONFIG.tierParticleScale[tier]
  );
}

export function resolveEffectiveDprMax(
  tierDprMax: number,
  quality: PerformanceQuality,
): number {
  return Math.max(
    1,
    tierDprMax * PERFORMANCE_CONFIG.quality[quality].dprScale,
  );
}
