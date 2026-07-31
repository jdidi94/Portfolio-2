import type { Vector3Tuple } from "three";
import { SECTION_NAV_STOPS, SECTIONS } from "@config/sections";
import { ABOUT_CHARACTER_CONFIG } from "@config/aboutCharacter";
import { sortTechnologiesForHiveCluster } from "@config/techHiveVisual";
import { resolveTechHiveIconUrl } from "@config/techHiveIconMap";
import { projects } from "@data/projects";
import { experience } from "@data/experience";
import { technologies } from "@data/technologies";
import { resolveElevatorLayout } from "@config/elevator";
import type { Technology } from "@shared-types/content";
import { ABOUT_WAYPOINT_ID, aboutBeatObjectId } from "@utils/aboutIds";
import { projectObjectId } from "@utils/projectIds";
import { experienceObjectId } from "@utils/experienceIds";
import { techObjectId, HIVE_WAYPOINT_ID } from "@utils/techIds";
import { timelineObjectId, ELEVATOR_WAYPOINT_ID } from "@utils/elevatorIds";
import { EXPERIENCE_WAYPOINT_ID } from "@utils/experienceIds";
import { PROJECT_CAROUSEL_WAYPOINT_ID } from "@utils/projectIds";

/** Scroll / swipe axis metaphor (all travel is still one-dimensional scroll). */
export type MobileItemAxis = "x" | "y" | "z" | "page" | "none";

export interface MobileSectionRailConfig {
  stopIndex: number;
  stopId: string;
  sectionId: (typeof SECTIONS)[number]["id"];
  label: string;
  axis: MobileItemAxis;
  itemCount: number;
}

export const MOBILE_NAV_CONFIG = {
  /** Wheel / swipe cooldown (ms). */
  stepCooldownMs: 380,
  /** Min pointer travel (px) to count as a swipe. */
  swipeThresholdPx: 42,
  /**
   * Extra stand-off multiplier on small so one card fills ~95% of width.
   * Applied on top of viewport `cameraDistanceScale`.
   */
  cardFillDistanceScale: 0.42,
  /** Eye height offset above card look-at. */
  focusEyeHeight: 0.12,
  /** Absolute camera Z stand-off when resolving mobile card targets. */
  focusDistance: 3.15,
  /** Neighbor cards stay co-located; tiny Z peek only. */
  stackPeekZ: 0.04,
  /** Card model scale for full-bleed mobile framing. */
  cardModelScale: 1.72,
  /** Shared carousel motion — matches desktop card settle feel. */
  carouselSnapSeconds: 0.82,
  carouselSnapEase: "power3.inOut",
  /** About vertical carousel — world Y gap between beat centers. */
  aboutCarouselSpacingY: 2.05,
  /** Projects horizontal carousel — world X gap between card centers. */
  projectCarouselSpacingX: 2.15,
  /** Experience horizontal carousel — world X gap between role centers. */
  experienceCarouselSpacingX: 2.15,
  /** Tech: one-card pop / unpop carousel. */
  techCardModelScale: 1.65,
  /** Closer stand-off for a single logo card filling the frame. */
  techFocusDistance: 3.25,
  techPopInSeconds: 0.42,
  techPopOutSeconds: 0.28,
  techPopInEase: "back.out(1.6)",
  techPopOutEase: "power2.in",
  /** Timeline stairs focus carousel — step offsets from the focused card. */
  timelineStairSpacingY: 1.45,
  timelineStairSpacingZ: 0.85,
  timelineStairSpacingX: 0.1,
  /** Raise the whole stairs cluster so focused face text sits higher in frame. */
  timelineClusterOffsetY: 0.95,
  timelineFocusDistance: 3.55,
  timelineFocusEyeHeight: 0.28,
  timelineCardModelScale: 1.72,
} as const;

function techItemCount(): number {
  return Math.max(1, orderedTechnologies().length);
}

function orderedTechnologies(): Technology[] {
  return sortTechnologiesForHiveCluster(
    technologies.filter((tech) => resolveTechHiveIconUrl(tech.id) !== null),
  );
}

function timelinePlatforms(): ReturnType<
  typeof resolveElevatorLayout
>["platforms"] {
  return resolveElevatorLayout("desktop").platforms;
}

/**
 * Ordered mobile rails — one entry per SECTION_NAV_STOPS.
 * Every content card is its own scroll item (no HTML strips / pages-of-4).
 */
export function resolveMobileRails(): readonly MobileSectionRailConfig[] {
  return SECTION_NAV_STOPS.map((stopId, stopIndex) => {
    const section = SECTIONS.find((s) => s.waypointId === stopId);
    const sectionId = section?.id ?? "hero";
    const label = section?.label ?? "Section";

    switch (sectionId) {
      case "about":
        return {
          stopIndex,
          stopId,
          sectionId,
          label,
          axis: "y" as const,
          itemCount: ABOUT_CHARACTER_CONFIG.beats.length,
        };
      case "projects":
        return {
          stopIndex,
          stopId,
          sectionId,
          label,
          axis: "x" as const,
          itemCount: Math.max(1, projects.length),
        };
      case "experience":
        return {
          stopIndex,
          stopId,
          sectionId,
          label,
          axis: "x" as const,
          itemCount: Math.max(1, experience.length),
        };
      case "skills":
        return {
          stopIndex,
          stopId,
          sectionId,
          label,
          axis: "y" as const,
          itemCount: techItemCount(),
        };
      case "timeline":
        return {
          stopIndex,
          stopId,
          sectionId,
          label,
          axis: "z" as const,
          itemCount: Math.max(1, timelinePlatforms().length),
        };
      case "hero":
      case "contact":
      default:
        return {
          stopIndex,
          stopId,
          sectionId,
          label,
          axis: "none" as const,
          itemCount: 1,
        };
    }
  });
}

export function mobileRailForStopId(
  stopId: string,
): MobileSectionRailConfig | undefined {
  return resolveMobileRails().find((rail) => rail.stopId === stopId);
}

/** Object id the camera / highlight should lock onto for a rail item. */
export function resolveMobileItemObjectId(
  stopId: string,
  itemIndex: number,
): string {
  const rail = mobileRailForStopId(stopId);
  if (!rail) return stopId;

  switch (rail.sectionId) {
    case "about": {
      const beat = ABOUT_CHARACTER_CONFIG.beats[itemIndex];
      return beat ? aboutBeatObjectId(beat.id) : ABOUT_WAYPOINT_ID;
    }
    case "projects": {
      const project = projects[itemIndex];
      return project
        ? projectObjectId(project.id)
        : PROJECT_CAROUSEL_WAYPOINT_ID;
    }
    case "experience": {
      const role = experience[itemIndex];
      return role ? experienceObjectId(role.id) : EXPERIENCE_WAYPOINT_ID;
    }
    case "skills": {
      const tech = orderedTechnologies()[itemIndex];
      return tech ? techObjectId(tech.id) : HIVE_WAYPOINT_ID;
    }
    case "timeline": {
      const platform = timelinePlatforms()[itemIndex];
      return platform ? timelineObjectId(platform.id) : ELEVATOR_WAYPOINT_ID;
    }
    default:
      return stopId;
  }
}

/**
 * Close framing for the active mobile card — lookAt is section-local world point.
 * Camera sits on +Z so the card fills ~95% of the phone width.
 */
export function resolveMobileCardFraming(
  lookAt: Vector3Tuple,
  focusDistance: number = MOBILE_NAV_CONFIG.focusDistance,
  focusEyeHeight: number = MOBILE_NAV_CONFIG.focusEyeHeight,
): { cameraPosition: Vector3Tuple; lookAt: Vector3Tuple } {
  const [x, y, z] = lookAt;
  return {
    lookAt: [x, y, z],
    cameraPosition: [
      x,
      y + focusEyeHeight,
      z + focusDistance,
    ],
  };
}

/** @deprecated Prefer one-at-a-time via mobileOrderedTechnologies + itemIndex. */
export function technologiesForMobilePage(pageIndex: number): Technology[] {
  const tech = orderedTechnologies()[pageIndex];
  return tech ? [tech] : [];
}

export function mobileOrderedTechnologies(): Technology[] {
  return orderedTechnologies();
}

export function mobileTimelinePlatforms(): ReturnType<
  typeof resolveElevatorLayout
>["platforms"] {
  return timelinePlatforms();
}
