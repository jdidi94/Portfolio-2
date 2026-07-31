import type { Vector3Tuple } from "three";
import { sectionPosition } from "@config/corridor";
import type { ViewportTier } from "@config/viewport";

/**
 * Circular project carousel — layout, motion, and camera stand-off.
 * All magic numbers live here; the scene reads from this config only.
 */
export const PROJECT_CAROUSEL_CONFIG = {
  origin: sectionPosition("projects") as Vector3Tuple,
  /** Ring radius in world units (desktop). */
  radius: 4.2,
  /** Mid-tier radius scale. */
  midRadiusScale: 0.85,
  /** Radians per second while idle. */
  idleRotationSpeed: 0.08,
  /** Pointer drag → radians (pixels * sensitivity). */
  dragSensitivity: 0.005,
  /** Scale when a card is nearest the camera. */
  frontScale: 1,
  /** Scale at the back of the ring. */
  backScale: 0.78,
  /** Vertical jitter amplitude (world units). */
  yJitter: 0.22,
  /** Extra depth jitter along radius (world units). */
  depthJitter: 0.35,
  /** GSAP snap duration when selecting / stepping. */
  transitionSeconds: 0.65,
  /** GSAP ease for snap-to-front. */
  focusEase: "power2.inOut",
  cameraDistance: 9.5,
  cameraEyeHeight: 0.45,
  /** Seconds without input before idle spin resumes. */
  idleResumeDelaySeconds: 1.2,
} as const;

export type ProjectCarouselConfig = typeof PROJECT_CAROUSEL_CONFIG;

export interface ProjectCarouselSlot {
  index: number;
  /** Local position relative to carousel origin (before group spin). */
  position: Vector3Tuple;
  /** Yaw so the card face looks toward the ring center. */
  yaw: number;
  /** Deterministic phase for Float. */
  phase: number;
}

export interface ProjectCarouselLayout {
  origin: Vector3Tuple;
  radius: number;
  slots: readonly ProjectCarouselSlot[];
}

export function radiusForTier(tier: ViewportTier): number {
  if (tier === "mid") {
    return PROJECT_CAROUSEL_CONFIG.radius * PROJECT_CAROUSEL_CONFIG.midRadiusScale;
  }
  return PROJECT_CAROUSEL_CONFIG.radius;
}

/**
 * Equal-angle ring in XZ. Index 0 sits at +Z (toward a +Z camera stand-off).
 * Parent group rotation of `-slotAngle(i)` brings slot i to the front.
 */
export function resolveProjectCarouselLayout(
  count: number,
  tier: ViewportTier = "desktop",
): ProjectCarouselLayout {
  const origin = PROJECT_CAROUSEL_CONFIG.origin;
  const radius = radiusForTier(tier);
  const slots: ProjectCarouselSlot[] = [];

  if (count <= 0) {
    return { origin, radius, slots };
  }

  for (let index = 0; index < count; index += 1) {
    const angle = slotAngle(index, count);
    const jitterSign = index % 2 === 0 ? 1 : -1;
    const y =
      Math.sin(index * 1.7) * PROJECT_CAROUSEL_CONFIG.yJitter * jitterSign;
    const r =
      radius +
      Math.cos(index * 2.3) * PROJECT_CAROUSEL_CONFIG.depthJitter * 0.5;
    const x = Math.sin(angle) * r;
    const z = Math.cos(angle) * r;
    // Face outward so the camera-side card is readable (overview stand-off).
    const yaw = angle;
    slots.push({
      index,
      position: [x, y, z],
      yaw,
      phase: index * 0.85,
    });
  }

  return { origin, radius, slots };
}

/** Angle (radians) of slot `index` on a ring of `count` cards. */
export function slotAngle(index: number, count: number): number {
  if (count <= 0) return 0;
  return (Math.PI * 2 * index) / count;
}

/**
 * Group Y rotation that places `frontIndex` at the camera-facing slot (+Z).
 */
export function rotationForFrontIndex(frontIndex: number, count: number): number {
  return -slotAngle(frontIndex, count);
}

/**
 * Scale factor from signed shortest angle to the front (0 = front, ±π = back).
 */
export function scaleForAngleOffset(angleOffset: number): number {
  const { frontScale, backScale } = PROJECT_CAROUSEL_CONFIG;
  const t = Math.min(1, Math.abs(normalizeAngle(angleOffset)) / Math.PI);
  return frontScale + (backScale - frontScale) * t;
}

/** Wrap to (-π, π]. */
export function normalizeAngle(angle: number): number {
  let a = angle;
  while (a > Math.PI) a -= Math.PI * 2;
  while (a <= -Math.PI) a += Math.PI * 2;
  return a;
}

export function projectCarouselWaypoint(): {
  position: Vector3Tuple;
  cameraPosition: Vector3Tuple;
  lookAt: Vector3Tuple;
} {
  const [x, y, z] = PROJECT_CAROUSEL_CONFIG.origin;
  const distance = PROJECT_CAROUSEL_CONFIG.cameraDistance;
  const eye = PROJECT_CAROUSEL_CONFIG.cameraEyeHeight;
  return {
    position: PROJECT_CAROUSEL_CONFIG.origin,
    cameraPosition: [x, y + eye, z + distance],
    lookAt: PROJECT_CAROUSEL_CONFIG.origin,
  };
}
