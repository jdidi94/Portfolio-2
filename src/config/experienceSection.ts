import type { Vector3Tuple } from "three";
import { CORRIDOR_LAYOUT, sectionPosition } from "@config/corridor";
import type { ViewportTier } from "@config/viewport";
import { EXPERIENCE_WAYPOINT_ID } from "@utils/experienceIds";
import { experience } from "@data/experience";

/**
 * Inline Experience row — three role cards on one depth band.
 * Overview camera stays fixed; click opens HTML role panel (like projects).
 */
export const EXPERIENCE_SECTION_CONFIG = {
  origin: sectionPosition("experience") as Vector3Tuple,
  /** Lateral gap between card centers (desktop). */
  spacingX: CORRIDOR_LAYOUT.fanX.projectsInner,
  midSpacingScale: 0.82,
  smallSpacingScale: 0.62,
  /** Overview stand-off; viewport `cameraDistanceScale` pulls closer on mid/small. */
  cameraDistance: 8.2,
  cameraEyeHeight: 0.4,
  cardModelScale: 2.1,
  floatAmplitude: 0.04,
  transitionSeconds: 0.55,
} as const;

export type ExperienceSectionConfig = typeof EXPERIENCE_SECTION_CONFIG;

export function spacingForTier(tier: ViewportTier): number {
  if (tier === "mid") {
    return (
      EXPERIENCE_SECTION_CONFIG.spacingX *
      EXPERIENCE_SECTION_CONFIG.midSpacingScale
    );
  }
  if (tier === "small") {
    return (
      EXPERIENCE_SECTION_CONFIG.spacingX *
      EXPERIENCE_SECTION_CONFIG.smallSpacingScale
    );
  }
  return EXPERIENCE_SECTION_CONFIG.spacingX;
}

export function experienceSlotPositions(
  count: number,
  tier: ViewportTier = "desktop",
): readonly Vector3Tuple[] {
  if (count <= 0) return [];
  const spacing = spacingForTier(tier);
  const startX = -((count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, index) => {
    return [startX + index * spacing, 0, 0] as Vector3Tuple;
  });
}

export function experienceOverviewWaypoint(): {
  id: string;
  label: string;
  position: Vector3Tuple;
  cameraPosition: Vector3Tuple;
  lookAt: Vector3Tuple;
} {
  const [x, y, z] = EXPERIENCE_SECTION_CONFIG.origin;
  const distance = EXPERIENCE_SECTION_CONFIG.cameraDistance;
  const eye = EXPERIENCE_SECTION_CONFIG.cameraEyeHeight;
  return {
    id: EXPERIENCE_WAYPOINT_ID,
    label: "Experience",
    position: EXPERIENCE_SECTION_CONFIG.origin,
    cameraPosition: [x, y + eye, z + distance],
    lookAt: EXPERIENCE_SECTION_CONFIG.origin,
  };
}

export function experienceCardCount(): number {
  return experience.length;
}
