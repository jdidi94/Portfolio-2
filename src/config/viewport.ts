/**
 * Viewport tiers for mid / small screens.
 * Narrower widths bring the focus camera closer for readable card faces —
 * not a separate mobile site.
 */
export type ViewportTier = "desktop" | "mid" | "small";

export const VIEWPORT_BREAKPOINTS = {
  smallMax: 767,
  midMax: 1023,
} as const;

export interface ViewportExperienceConfig {
  fov: number;
  /**
   * Multiplies focus camera stand-off from each card lookAt.
   * Values &lt; 1 pull closer (preferred on mid/small for reading).
   */
  cameraDistanceScale: number;
  /** Explore / overview camera Z. */
  exploreZ: number;
  /** Multiplier on the baked card model scale (2.4 desktop). */
  cardScaleMultiplier: number;
  /** Compresses lateral corridor spacing so side cards stay in frame. */
  corridorScaleX: number;
  /** Scales pointer-driven camera pan freedom. */
  panScale: number;
  /** Extra hit-box scale for reliable tap targets. */
  hitScale: number;
  /** Softens idle float on smaller screens. */
  floatScale: number;
  dprMax: number;
}

/**
 * Discrete knobs per tier (layout / performance).
 * Focus distance is continuous via `focusDistanceScaleForWidth`.
 */
export const VIEWPORT_EXPERIENCE: Record<
  ViewportTier,
  Omit<ViewportExperienceConfig, "cameraDistanceScale"> & {
    /** Fallback when width interpolation is not used. */
    cameraDistanceScale: number;
  }
> = {
  desktop: {
    fov: 42,
    cameraDistanceScale: 1,
    exploreZ: 10.67,
    cardScaleMultiplier: 1,
    corridorScaleX: 1,
    panScale: 1,
    hitScale: 1,
    floatScale: 1,
    dprMax: 1.75,
  },
  mid: {
    fov: 46,
    cameraDistanceScale: 0.88,
    exploreZ: 10.33,
    cardScaleMultiplier: 0.92,
    corridorScaleX: 0.78,
    panScale: 0.85,
    hitScale: 1.15,
    floatScale: 0.85,
    dprMax: 1.5,
  },
  small: {
    fov: 50,
    cameraDistanceScale: 0.74,
    exploreZ: 9.67,
    cardScaleMultiplier: 0.84,
    corridorScaleX: 0.55,
    panScale: 0.55,
    hitScale: 1.4,
    floatScale: 0.6,
    dprMax: 1.25,
  },
} as const;

/**
 * Portrait phones: slight FOV bump + closer focus for readable type,
 * with tighter lateral corridor so side cards stay in frame.
 */
const PORTRAIT_ADJUSTMENT = {
  fovDelta: 4,
  /** Pull closer in portrait (was 1.12 pull-back). */
  cameraDistanceScale: 0.92,
  exploreZDelta: -0.5,
  corridorScaleX: 0.85,
  cardScaleMultiplier: 0.94,
  panScale: 0.9,
} as const;

function clamp01(t: number): number {
  return Math.min(1, Math.max(0, t));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function tierFromWidth(width: number): ViewportTier {
  if (width <= VIEWPORT_BREAKPOINTS.smallMax) {
    return "small";
  }
  if (width <= VIEWPORT_BREAKPOINTS.midMax) {
    return "mid";
  }
  return "desktop";
}

export function isPortraitSize(width: number, height: number): boolean {
  return height > width;
}

/**
 * Continuous focus stand-off: smaller width → closer camera for reading.
 * Desktop (>1023) stays at 1. At mid/small, interpolates toward a closer frame.
 */
export function focusDistanceScaleForWidth(width: number): number {
  const { smallMax, midMax } = VIEWPORT_BREAKPOINTS;
  if (width > midMax) {
    return VIEWPORT_EXPERIENCE.desktop.cameraDistanceScale;
  }
  if (width <= smallMax) {
    // Phones: ~0.68 at 320px → ~0.78 at 767px
    const t = clamp01((width - 320) / (smallMax - 320));
    return lerp(0.68, 0.78, t);
  }
  // Tablets: ~0.78 at 768px → ~0.95 at 1023px
  const t = clamp01((width - smallMax) / (midMax - smallMax));
  return lerp(0.78, 0.95, t);
}

/**
 * Resolves experience knobs for the current window size.
 * Focus distance tracks width continuously; other knobs use discrete tiers.
 */
export function experienceForSize(
  width: number,
  height: number,
): ViewportExperienceConfig & {
  tier: ViewportTier;
  isPortrait: boolean;
} {
  const tier = tierFromWidth(width);
  const base = VIEWPORT_EXPERIENCE[tier];
  const portrait = isPortraitSize(width, height);
  const focusScale = focusDistanceScaleForWidth(width);

  if (!portrait || tier === "desktop") {
    return {
      ...base,
      cameraDistanceScale: focusScale,
      tier,
      isPortrait: portrait,
    };
  }

  return {
    fov: base.fov + PORTRAIT_ADJUSTMENT.fovDelta,
    cameraDistanceScale:
      focusScale * PORTRAIT_ADJUSTMENT.cameraDistanceScale,
    exploreZ: base.exploreZ + PORTRAIT_ADJUSTMENT.exploreZDelta,
    cardScaleMultiplier:
      base.cardScaleMultiplier * PORTRAIT_ADJUSTMENT.cardScaleMultiplier,
    corridorScaleX: base.corridorScaleX * PORTRAIT_ADJUSTMENT.corridorScaleX,
    panScale: base.panScale * PORTRAIT_ADJUSTMENT.panScale,
    hitScale: base.hitScale,
    floatScale: base.floatScale,
    dprMax: base.dprMax,
    tier,
    isPortrait: true,
  };
}
