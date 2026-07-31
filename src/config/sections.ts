import type { ExperienceSection } from "@experience/ExperienceState";
import type { Vector3Tuple } from "three";
import type { ContentCardKind } from "@shared-types/content";
import { placementWithCamera } from "@config/cardLayout";
import { sectionPosition } from "@config/corridor";
import { HIVE_WAYPOINT_ID, isTechObjectId } from "@utils/techIds";
import {
  PROJECT_CAROUSEL_WAYPOINT_ID,
  isProjectObjectId,
} from "@utils/projectIds";
import {
  ELEVATOR_WAYPOINT_ID,
  isElevatorObjectId,
} from "@utils/elevatorIds";
import { ABOUT_WAYPOINT_ID, isAboutObjectId } from "@utils/aboutIds";
import {
  EXPERIENCE_WAYPOINT_ID,
  isExperienceObjectId,
} from "@utils/experienceIds";

export interface SectionConfig {
  id: ExperienceSection;
  label: string;
  /** Primary waypoint used by section-level scroll navigation. */
  waypointId: string;
}

export interface ContentCardPlacement {
  objectId: string;
  section: ExperienceSection;
  contentId: string;
  kind: ContentCardKind;
  label: string;
  position: Vector3Tuple;
  cameraPosition: Vector3Tuple;
  lookAt: Vector3Tuple;
  variant: ContentCardKind;
}

/**
 * Ordered narrative stops for wheel / arrow navigation.
 * One stop per section — not every individual card.
 */
export const SECTIONS: readonly SectionConfig[] = [
  { id: "hero", label: "Hero", waypointId: "hero" },
  { id: "about", label: "About", waypointId: ABOUT_WAYPOINT_ID },
  { id: "projects", label: "Projects", waypointId: PROJECT_CAROUSEL_WAYPOINT_ID },
  {
    id: "experience",
    label: "Experience",
    waypointId: EXPERIENCE_WAYPOINT_ID,
  },
  { id: "skills", label: "Technologies", waypointId: HIVE_WAYPOINT_ID },
  { id: "timeline", label: "Timeline", waypointId: ELEVATOR_WAYPOINT_ID },
  { id: "contact", label: "Contact", waypointId: "contact" },
] as const;

/**
 * Unique section stops in travel order.
 * Certificate lives inside the elevator (2021 education platform).
 */
export const SECTION_NAV_STOPS: readonly string[] = [
  "hero",
  ABOUT_WAYPOINT_ID,
  PROJECT_CAROUSEL_WAYPOINT_ID,
  EXPERIENCE_WAYPOINT_ID,
  HIVE_WAYPOINT_ID,
  ELEVATOR_WAYPOINT_ID,
  "contact",
];

function card(
  base: Omit<
    ContentCardPlacement,
    "position" | "cameraPosition" | "lookAt"
  > & { position: Vector3Tuple },
): ContentCardPlacement {
  const camera = placementWithCamera(base.position, base.kind);
  return {
    ...base,
    ...camera,
  };
}

/**
 * Corridor anchors only — About, Projects, Experience, Hive, and Timeline use dedicated sections.
 * Alternating lanes: Hero → About → Projects (up) → Experience (down) → Hive (up)
 * → Elevator (down) → Contact (center).
 */
export const CONTENT_CARD_PLACEMENTS: readonly ContentCardPlacement[] = [
  card({
    objectId: "hero",
    section: "hero",
    contentId: "profile",
    kind: "hero",
    label: "Hero",
    position: sectionPosition("hero"),
    variant: "hero",
  }),
  card({
    objectId: "contact",
    section: "contact",
    contentId: "contact",
    kind: "contact",
    label: "Contact",
    position: sectionPosition("contact"),
    variant: "contact",
  }),
] as const;

export function findPlacement(
  objectId: string,
): ContentCardPlacement | undefined {
  return CONTENT_CARD_PLACEMENTS.find((item) => item.objectId === objectId);
}

export function sectionForObjectId(
  objectId: string,
): ExperienceSection | "none" {
  if (isAboutObjectId(objectId)) {
    return "about";
  }
  if (objectId === HIVE_WAYPOINT_ID || isTechObjectId(objectId)) {
    return "skills";
  }
  if (
    objectId === PROJECT_CAROUSEL_WAYPOINT_ID ||
    isProjectObjectId(objectId)
  ) {
    return "projects";
  }
  if (isElevatorObjectId(objectId)) {
    return "timeline";
  }
  if (isExperienceObjectId(objectId)) {
    return "experience";
  }
  return findPlacement(objectId)?.section ?? "none";
}

/** Map any focusable object to its section-nav stop id. */
export function sectionStopForObjectId(objectId: string): string | null {
  if (isAboutObjectId(objectId)) {
    return ABOUT_WAYPOINT_ID;
  }
  if (objectId === HIVE_WAYPOINT_ID || isTechObjectId(objectId)) {
    return HIVE_WAYPOINT_ID;
  }
  if (
    objectId === PROJECT_CAROUSEL_WAYPOINT_ID ||
    isProjectObjectId(objectId)
  ) {
    return PROJECT_CAROUSEL_WAYPOINT_ID;
  }
  if (isElevatorObjectId(objectId)) {
    return ELEVATOR_WAYPOINT_ID;
  }
  if (isExperienceObjectId(objectId)) {
    return EXPERIENCE_WAYPOINT_ID;
  }
  const placement = findPlacement(objectId);
  if (!placement) {
    return null;
  }
  const stop = SECTIONS.find((section) => section.id === placement.section);
  return stop?.waypointId ?? placement.objectId;
}
