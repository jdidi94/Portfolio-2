import type { Vector3Tuple } from "three";
import { CONTENT_CARD_PLACEMENTS } from "@config/sections";
import { CARD_LAYOUT } from "@config/cardLayout";
import {
  TECH_HIVE_LAYOUT_DEFAULTS,
  resolveTechHiveLayout,
  visibleTechCountForTier,
} from "@config/techHiveLayout";
import { projectCarouselWaypoint } from "@config/projectCarousel";
import {
  experienceOverviewWaypoint,
  experienceSlotPositions,
} from "@config/experienceSection";
import { elevatorWaypoint, elevatorDetailWaypoint } from "@config/elevator";
import {
  aboutBeatWaypoint,
  aboutCharacterWaypoint,
  ABOUT_CHARACTER_CONFIG,
} from "@config/aboutCharacter";
import { technologies } from "@data/technologies";
import { experience } from "@data/experience";
import { HIVE_WAYPOINT_ID } from "@utils/techIds";
import { PROJECT_CAROUSEL_WAYPOINT_ID } from "@utils/projectIds";
import {
  ELEVATOR_WAYPOINT_ID,
  ELEVATOR_DETAIL_WAYPOINT_ID,
} from "@utils/elevatorIds";
import { ABOUT_WAYPOINT_ID } from "@utils/aboutIds";
import {
  EXPERIENCE_WAYPOINT_ID,
  experienceObjectId,
} from "@utils/experienceIds";

export interface WaypointConfig {
  id: string;
  label: string;
  position: Vector3Tuple;
  cameraPosition: Vector3Tuple;
  lookAt: Vector3Tuple;
  /**
   * When false, reachable by direct focus but skipped
   * by linear corridor scroll navigation.
   */
  navigable?: boolean;
}

export const EXPLORE_WAYPOINT_ID = "origin";
export { HIVE_WAYPOINT_ID };
export { PROJECT_CAROUSEL_WAYPOINT_ID };
export { ELEVATOR_WAYPOINT_ID };
export { ELEVATOR_DETAIL_WAYPOINT_ID };
export { ABOUT_WAYPOINT_ID };
export { EXPERIENCE_WAYPOINT_ID };

const originWaypoint: WaypointConfig = {
  id: EXPLORE_WAYPOINT_ID,
  label: "Origin",
  position: [0, 0, 0],
  cameraPosition: CARD_LAYOUT.explore.cameraPosition,
  lookAt: CARD_LAYOUT.explore.lookAt,
};

function hiveOverviewWaypoint(): WaypointConfig {
  const childCount = Math.min(
    visibleTechCountForTier(TECH_HIVE_LAYOUT_DEFAULTS, "desktop"),
    technologies.length,
  );
  const layout = resolveTechHiveLayout(TECH_HIVE_LAYOUT_DEFAULTS, childCount);
  const [x, y, z] = layout.origin;
  const distance = TECH_HIVE_LAYOUT_DEFAULTS.cameraDistance;
  const eye = TECH_HIVE_LAYOUT_DEFAULTS.cameraEyeHeight;
  return {
    id: HIVE_WAYPOINT_ID,
    label: "Technology Hive",
    position: layout.origin,
    cameraPosition: [x, y + eye, z + distance],
    lookAt: layout.origin,
    navigable: true,
  };
}

function projectsCarouselOverviewWaypoint(): WaypointConfig {
  const layout = projectCarouselWaypoint();
  return {
    id: PROJECT_CAROUSEL_WAYPOINT_ID,
    label: "Projects",
    position: layout.position,
    cameraPosition: layout.cameraPosition,
    lookAt: layout.lookAt,
    navigable: true,
  };
}

function elevatorOverviewWaypoint(): WaypointConfig {
  const layout = elevatorWaypoint();
  return {
    id: layout.id,
    label: layout.label,
    position: layout.position,
    cameraPosition: layout.cameraPosition,
    lookAt: layout.lookAt,
    navigable: true,
  };
}

function elevatorDetailFocusWaypoint(): WaypointConfig {
  const layout = elevatorDetailWaypoint();
  return {
    id: layout.id,
    label: layout.label,
    position: layout.position,
    cameraPosition: layout.cameraPosition,
    lookAt: layout.lookAt,
    navigable: false,
  };
}

function aboutOverviewWaypoint(): WaypointConfig {
  const layout = aboutCharacterWaypoint();
  return {
    id: layout.id,
    label: layout.label,
    position: layout.position,
    cameraPosition: layout.cameraPosition,
    lookAt: layout.lookAt,
    navigable: true,
  };
}

function aboutBeatWaypoints(): WaypointConfig[] {
  return ABOUT_CHARACTER_CONFIG.beats.map((beat) => aboutBeatWaypoint(beat));
}

function experienceBandWaypoints(): WaypointConfig[] {
  const overview = experienceOverviewWaypoint();
  const slots = experienceSlotPositions(experience.length, "desktop");
  const [ox, oy, oz] = overview.position;
  const cardWaypoints: WaypointConfig[] = experience.map((role, index) => {
    const slot = slots[index] ?? ([0, 0, 0] as const);
    const position: Vector3Tuple = [
      ox + slot[0],
      oy + slot[1],
      oz + slot[2],
    ];
    return {
      id: experienceObjectId(role.id),
      label: role.position,
      position,
      cameraPosition: overview.cameraPosition,
      lookAt: position,
      navigable: false,
    };
  });
  return [
    {
      id: overview.id,
      label: overview.label,
      position: overview.position,
      cameraPosition: overview.cameraPosition,
      lookAt: overview.lookAt,
      navigable: true,
    },
    ...cardWaypoints,
  ];
}

function isPostHiveCard(objectId: string): boolean {
  return objectId === "contact";
}

function isPreProjectsCard(objectId: string): boolean {
  return objectId === "hero";
}

const cardWaypoints: WaypointConfig[] = CONTENT_CARD_PLACEMENTS.map((card) => ({
  id: card.objectId,
  label: card.label,
  position: card.position,
  cameraPosition: card.cameraPosition,
  lookAt: card.lookAt,
  navigable: true,
}));

const preProjectCards = cardWaypoints.filter((wp) => isPreProjectsCard(wp.id));
const postHiveCards = cardWaypoints.filter((wp) => isPostHiveCard(wp.id));

/**
 * Corridor order: hero → About → Project Carousel → Experience → Technology Hive
 * → Elevator → contact.
 */
export const WAYPOINTS: readonly WaypointConfig[] = [
  originWaypoint,
  ...preProjectCards,
  aboutOverviewWaypoint(),
  ...aboutBeatWaypoints(),
  projectsCarouselOverviewWaypoint(),
  ...experienceBandWaypoints(),
  hiveOverviewWaypoint(),
  elevatorOverviewWaypoint(),
  elevatorDetailFocusWaypoint(),
  ...postHiveCards,
];
