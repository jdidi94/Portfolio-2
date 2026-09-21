import type { Vector3Tuple } from "three";
import { SECTION_NAV_STOPS, SECTIONS } from "@config/sections";
import { ABOUT_CHARACTER_CONFIG } from "@config/aboutCharacter";
import { sortTechnologiesForHiveCluster } from "@config/techHiveVisual";
import { resolveTechHiveIconUrl } from "@config/techHiveIconMap";
import { TECH_HIVE_LEGEND_ITEMS } from "@config/techHiveLegend";
import { projects } from "@data/projects";
import { experience } from "@data/experience";
import { technologies } from "@data/technologies";
import { resolveElevatorLayout } from "@config/elevator";
import type { Technology } from "@shared-types/content";
import { ABOUT_WAYPOINT_ID, aboutBeatObjectId } from "@utils/aboutIds";
import { projectObjectId } from "@utils/projectIds";
import { experienceObjectId } from "@utils/experienceIds";
import {
  techObjectId,
  techCategoryObjectId,
  HIVE_WAYPOINT_ID,
} from "@utils/techIds";
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

export type MobileTechRailItem = {
  kind: "category";
  id: string;
  label: string;
  techs: Technology[];
};

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
  /**
   * First section (Hero) — pull back so the full glass silhouette fits
   * on-screen without clipped edges on phones.
   */
  heroFocusDistance: 4.65,
  /**
   * Pull-back for text-heavy section cards (About first beat, Contact).
   * Slightly farther so faces aren’t clipped on phones.
   */
  sectionCardFocusDistance: 4.25,
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
  /** Max logos per category page (label at center, logos on ring). */
  techPageSize: 3,
  /** Logo hex scale (matches desktop hive children feel). */
  techCardModelScale: 1.05,
  /** Category label card at cluster center. */
  techCategoryLabelScale: 1.15,
  /** Center-to-center spacing for label + surrounding logos. */
  techClusterSpacing: 0.8,
  /** Rotation of the hex cluster around Z (radians). */
  techClusterRotationZ: 0,
  /** Stand-off for the category cluster. */
  techFocusDistance: 4.3,
  /** Eye height for mobile tech category framing. */
  techFocusEyeHeight: 0.6,
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
  /**
   * Sections that can show a bottom-right swipe guide when the visitor
   * seems stuck (idle without a successful step).
   */
  scrollArrowSectionIds: ["about", "projects", "timeline"] as const,
  /** Idle time before the scroll guide appears. */
  scrollHintIdleMs: 2400,
  /** How long the guide stays visible once shown. */
  scrollHintVisibleMs: 4800,
  /**
   * Timeline swipe / wheel is inverted vs About vertical scroll
   * (swipe up walks earlier milestones).
   */
  timelineInvertScroll: true,
} as const;

/** Rail sections that render movement arrows on mobile. */
export type MobileScrollArrowSectionId =
  (typeof MOBILE_NAV_CONFIG.scrollArrowSectionIds)[number];

export function showsMobileScrollArrows(sectionId: string): boolean {
  return (MOBILE_NAV_CONFIG.scrollArrowSectionIds as readonly string[]).includes(
    sectionId,
  );
}

/**
 * Maps a swipe to stepItem delta.
 * `axis: "none"` (Hero / Contact) still advances sections vertically.
 * Timeline vertical is inverted vs About (`timelineInvertScroll`).
 */
export function mobileStepDeltaForSwipe(
  sectionId: string,
  axis: MobileItemAxis,
  dx: number,
  dy: number,
): number | null {
  if (axis === "x") {
    // Swipe left → next.
    return dx < 0 ? 1 : -1;
  }

  // Vertical metaphor (y / z / page / none).
  const swipeUp = dy < 0;
  if (
    sectionId === "timeline" &&
    MOBILE_NAV_CONFIG.timelineInvertScroll
  ) {
    // Opposite of About: swipe up → previous.
    return swipeUp ? -1 : 1;
  }
  return swipeUp ? 1 : -1;
}

/** Wheel / trackpad: positive deltaY → step forward (unless timeline invert). */
export function mobileStepDeltaForWheel(
  sectionId: string,
  primaryDelta: number,
): number {
  const forward = primaryDelta > 0 ? 1 : -1;
  if (
    sectionId === "timeline" &&
    MOBILE_NAV_CONFIG.timelineInvertScroll
  ) {
    return -forward;
  }
  return forward;
}

function orderedTechnologies(): Technology[] {
  return sortTechnologiesForHiveCluster(
    technologies.filter((tech) => resolveTechHiveIconUrl(tech.id) !== null),
  );
}

function categoryLabel(categoryId: string): string {
  return (
    TECH_HIVE_LEGEND_ITEMS.find((item) => item.id === categoryId)?.label ??
    categoryId
  );
}

/** Tech rail: one pop per category page (label + up to pageSize logos). */
export function mobileTechRailItems(
  pageSize: number = MOBILE_NAV_CONFIG.techPageSize,
): MobileTechRailItem[] {
  const byCategory = new Map<string, Technology[]>();

  for (const tech of orderedTechnologies()) {
    const list = byCategory.get(tech.category);
    if (list) {
      list.push(tech);
    } else {
      byCategory.set(tech.category, [tech]);
    }
  }

  const size = Math.max(1, Math.round(pageSize));
  const items: MobileTechRailItem[] = [];

  for (const [id, techs] of byCategory) {
    const label = categoryLabel(id);
    for (let start = 0; start < techs.length; start += size) {
      const page = techs.slice(start, start + size);
      const pageIndex = Math.floor(start / size);
      items.push({
        kind: "category",
        id: pageIndex === 0 ? id : `${id}-${pageIndex}`,
        label,
        techs: page,
      });
    }
  }

  return items;
}

function techItemCount(): number {
  return Math.max(1, mobileTechRailItems(MOBILE_NAV_CONFIG.techPageSize).length);
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
      const item = mobileTechRailItems(MOBILE_NAV_CONFIG.techPageSize)[itemIndex];
      if (!item) return HIVE_WAYPOINT_ID;
      const mid = item.techs[Math.floor((item.techs.length - 1) / 2)];
      return mid ? techObjectId(mid.id) : techCategoryObjectId(item.id);
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
