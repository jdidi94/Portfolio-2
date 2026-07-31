import type { ExperienceSection } from "@experience/ExperienceState";
import type { Vector3Tuple } from "three";

/**
 * Spatial rhythm for the depth corridor.
 * Sections alternate vertical lanes (up / down / center) with large Z gaps
 * so camera travel reads as a journey — not a flat card stack.
 */
export type CorridorLane = "up" | "down" | "center";

export const CORRIDOR_LAYOUT = {
  laneY: {
    up: 2.55,
    down: -1.85,
    center: 0.55,
  },
  /**
   * Primary Z for each narrative section (more negative = deeper).
   * Keep ≥ ~10–12 units between section bands for readable camera travel.
   */
  sectionZ: {
    hero: -5,
    about: -14,
    projects: -28,
    experience: -44,
    skills: -60,
    timeline: -76,
    contact: -92,
  },
  /** Extra Z offset for secondary cards inside a section band. */
  bandDepth: {
    projectsSecondary: -7,
  },
  /** Lateral fan for multi-card sections. */
  fanX: {
    projectsOuter: 5.2,
    projectsInner: 3.6,
  },
} as const;

export const SECTION_LANE: Record<
  Exclude<ExperienceSection, "none">,
  CorridorLane
> = {
  hero: "center",
  about: "center",
  projects: "up",
  experience: "down",
  skills: "up",
  timeline: "down",
  contact: "center",
};

export function laneY(lane: CorridorLane): number {
  return CORRIDOR_LAYOUT.laneY[lane];
}

export function sectionPosition(
  section: keyof typeof CORRIDOR_LAYOUT.sectionZ,
  options?: {
    lane?: CorridorLane;
    x?: number;
    yOffset?: number;
    zOffset?: number;
  },
): Vector3Tuple {
  const lane = options?.lane ?? SECTION_LANE[section as keyof typeof SECTION_LANE] ?? "center";
  const x = options?.x ?? 0;
  const y = laneY(lane) + (options?.yOffset ?? 0);
  const z = CORRIDOR_LAYOUT.sectionZ[section] + (options?.zOffset ?? 0);
  return [x, y, z];
}
