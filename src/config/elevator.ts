import type { Vector3Tuple } from "three";
import { COLORS } from "@config/colors";
import { sectionPosition } from "@config/corridor";
import type { TimelineEvent } from "@shared-types/content";
import { timeline } from "@data/timeline";
import {
  ELEVATOR_FUTURE_ID,
  ELEVATOR_WAYPOINT_ID,
  ELEVATOR_DETAIL_WAYPOINT_ID,
} from "@utils/elevatorIds";
import type { ViewportTier } from "@config/viewport";

export type ElevatorCategory = TimelineEvent["category"] | "future";

/**
 * Infinite Elevator — vertical milestone shaft at the timeline corridor depth.
 * Ride progress lives in R3F refs; this config is layout + motion only.
 */
export const ELEVATOR_CONFIG = {
  origin: sectionPosition("timeline") as Vector3Tuple,
  /** World units between consecutive platforms. */
  platformSpacing: 4.2,
  /** Mid-tier spacing scale. */
  midSpacingScale: 0.9,
  /** Default arrival index into resolved platforms (2023 mentoring). */
  defaultPlatformIndex: 3,
  /** Continuous rise speed in platforms-per-second. */
  riseSpeed: 0.12,
  /** Speed multiplier while hovering a nearby platform. */
  hoverSlowdown: 0.22,
  /** How close (in platform units) before hover slowdown applies. */
  hoverSlowRadius: 0.55,
  /** GSAP snap duration when stepping / selecting. */
  snapSeconds: 0.85,
  snapEase: "power2.inOut",
  /** Seconds after interaction before rise resumes. */
  resumeDelaySeconds: 1.4,
  cameraDistance: 10.5,
  /**
   * Closer stand-off while reading a selected milestone card + HTML panel.
   * Selected platform is already snapped to eye level by the ride group.
   */
  detailCameraDistance: 5.6,
  cameraEyeHeight: 0.35,
  /** Platform disc radius. */
  platformRadius: 2.35,
  midPlatformRadiusScale: 0.88,
  /** Vertical light shaft height padding beyond first/last platform. */
  shaftPadding: 6,
  /** Milestone card local offset above the platform floor. */
  cardOffsetY: 1.15,
  cardOffsetZ: 0.35,
  /** Model scale for milestone FloatingCards. */
  cardModelScale: 1.65,
  midCardModelScale: 1.45,
  floatAmplitude: 0.028,
  categoryAccent: {
    education: COLORS.electricBlue,
    career: COLORS.purple,
    project: COLORS.cyan,
    life: COLORS.white,
    goal: COLORS.white,
    future: COLORS.white,
  } satisfies Record<ElevatorCategory, string>,
  future: {
    id: ELEVATOR_FUTURE_ID,
    yearLabel: "Next",
    title: "Your Company?",
    description:
      "The journey continues — let's build the next interactive experience together.",
    ctaLabel: "Start a conversation",
  },
} as const;

export type ElevatorConfig = typeof ELEVATOR_CONFIG;

export interface ElevatorPlatformSlot {
  index: number;
  /** Event id or ELEVATOR_FUTURE_ID. */
  id: string;
  yearLabel: string;
  title: string;
  description: string;
  category: ElevatorCategory;
  media?: string;
  link?: string;
  relatedProjectIds: readonly string[];
  relatedCertificateIds: readonly string[];
  /** Local Y relative to shaft origin (before ride offset). */
  localY: number;
  isFuture: boolean;
}

export interface ElevatorLayout {
  origin: Vector3Tuple;
  spacing: number;
  platformRadius: number;
  cardModelScale: number;
  platforms: readonly ElevatorPlatformSlot[];
  shaftHeight: number;
  /** Local Y of shaft center (midpoint of first/last). */
  shaftCenterY: number;
}

export function spacingForTier(tier: ViewportTier): number {
  if (tier === "mid") {
    return ELEVATOR_CONFIG.platformSpacing * ELEVATOR_CONFIG.midSpacingScale;
  }
  return ELEVATOR_CONFIG.platformSpacing;
}

export function platformRadiusForTier(tier: ViewportTier): number {
  if (tier === "mid") {
    return (
      ELEVATOR_CONFIG.platformRadius * ELEVATOR_CONFIG.midPlatformRadiusScale
    );
  }
  return ELEVATOR_CONFIG.platformRadius;
}

export function cardScaleForTier(tier: ViewportTier): number {
  if (tier === "mid") {
    return ELEVATOR_CONFIG.midCardModelScale;
  }
  return ELEVATOR_CONFIG.cardModelScale;
}

export function accentForCategory(category: ElevatorCategory): string {
  return ELEVATOR_CONFIG.categoryAccent[category];
}

/**
 * Chronological stack (oldest at bottom) + synthetic future platform on top.
 */
export function resolveElevatorLayout(
  tier: ViewportTier = "desktop",
): ElevatorLayout {
  const origin = ELEVATOR_CONFIG.origin;
  const spacing = spacingForTier(tier);
  const platformRadius = platformRadiusForTier(tier);
  const cardModelScale = cardScaleForTier(tier);

  const events = [...timeline].sort((a, b) => a.year - b.year);
  const platforms: ElevatorPlatformSlot[] = events.map((event, index) => ({
    index,
    id: event.id,
    yearLabel: String(event.year),
    title: event.title,
    description: event.description,
    category: event.category,
    media: event.media,
    link: event.link,
    relatedProjectIds: event.relatedProjectIds ?? [],
    relatedCertificateIds: event.relatedCertificateIds ?? [],
    localY: index * spacing,
    isFuture: false,
  }));

  const futureIndex = platforms.length;
  platforms.push({
    index: futureIndex,
    id: ELEVATOR_CONFIG.future.id,
    yearLabel: ELEVATOR_CONFIG.future.yearLabel,
    title: ELEVATOR_CONFIG.future.title,
    description: ELEVATOR_CONFIG.future.description,
    category: "future",
    relatedProjectIds: [],
    relatedCertificateIds: [],
    localY: futureIndex * spacing,
    isFuture: true,
  });

  const firstY = platforms[0]?.localY ?? 0;
  const lastY = platforms[platforms.length - 1]?.localY ?? 0;
  const shaftHeight = lastY - firstY + ELEVATOR_CONFIG.shaftPadding * 2;
  const shaftCenterY = (firstY + lastY) / 2;

  return {
    origin,
    spacing,
    platformRadius,
    cardModelScale,
    platforms,
    shaftHeight,
    shaftCenterY,
  };
}

export function clampPlatformIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return Math.max(0, Math.min(count - 1, index));
}

export function defaultRideProgress(layout: ElevatorLayout): number {
  return clampPlatformIndex(
    ELEVATOR_CONFIG.defaultPlatformIndex,
    layout.platforms.length,
  );
}

/**
 * Group Y offset so platform at `rideProgress` sits at the shaft origin eye.
 * Fractional progress interpolates between platforms.
 */
export function rideOffsetY(rideProgress: number, spacing: number): number {
  return -rideProgress * spacing;
}

export function elevatorWaypoint(): {
  id: string;
  label: string;
  position: Vector3Tuple;
  cameraPosition: Vector3Tuple;
  lookAt: Vector3Tuple;
} {
  const [x, y, z] = ELEVATOR_CONFIG.origin;
  const distance = ELEVATOR_CONFIG.cameraDistance;
  const eye = ELEVATOR_CONFIG.cameraEyeHeight;
  return {
    id: ELEVATOR_WAYPOINT_ID,
    label: "Timeline",
    position: ELEVATOR_CONFIG.origin,
    cameraPosition: [x, y + eye, z + distance],
    lookAt: ELEVATOR_CONFIG.origin,
  };
}

/** Zoomed framing for a selected milestone (same lookAt, shorter stand-off). */
export function elevatorDetailWaypoint(): {
  id: string;
  label: string;
  position: Vector3Tuple;
  cameraPosition: Vector3Tuple;
  lookAt: Vector3Tuple;
} {
  const [x, y, z] = ELEVATOR_CONFIG.origin;
  const distance = ELEVATOR_CONFIG.detailCameraDistance;
  const eye = ELEVATOR_CONFIG.cameraEyeHeight;
  return {
    id: ELEVATOR_DETAIL_WAYPOINT_ID,
    label: "Timeline detail",
    position: ELEVATOR_CONFIG.origin,
    cameraPosition: [x, y + eye, z + distance],
    lookAt: ELEVATOR_CONFIG.origin,
  };
}
