import { profile } from "@data/profile";
import { projects } from "@data/projects";
import { skills } from "@data/skills";
import { experience } from "@data/experience";
import { timeline } from "@data/timeline";
import { certificates } from "@data/certificates";
import { socialLinks } from "@data/social";
import {
  CONTENT_CARD_PLACEMENTS,
  findPlacement,
} from "@config/sections";
import {
  PROJECT_CAROUSEL_WAYPOINT_ID,
  projectIdFromObjectId,
  projectObjectId,
} from "@utils/projectIds";
import {
  EXPERIENCE_WAYPOINT_ID,
  experienceIdFromObjectId,
  experienceObjectId,
} from "@utils/experienceIds";
import {
  ELEVATOR_WAYPOINT_ID,
  timelineIdFromObjectId,
  timelineObjectId,
} from "@utils/elevatorIds";
import {
  ABOUT_WAYPOINT_ID,
  aboutBeatIdFromObjectId,
  aboutBeatObjectId,
  isAboutObjectId,
} from "@utils/aboutIds";
import { ELEVATOR_CONFIG, resolveElevatorLayout } from "@config/elevator";
import { ABOUT_CHARACTER_CONFIG } from "@config/aboutCharacter";
import type {
  Certificate,
  ContentFocusTarget,
  Experience,
  Profile,
  Project,
  Skill,
  SocialLink,
  TimelineEvent,
} from "@shared-types/content";

export type FocusedContent =
  | { kind: "hero"; data: Profile }
  | { kind: "about"; data: Profile; beatId: string | null }
  | { kind: "project"; data: Project }
  | { kind: "skill"; data: Skill }
  | { kind: "experience"; data: Experience }
  | { kind: "timeline"; data: TimelineEvent }
  | { kind: "certificate"; data: Certificate }
  | {
      kind: "contact";
      data: { profile: Profile; links: readonly SocialLink[] };
    };

const placementTargets: ContentFocusTarget[] = CONTENT_CARD_PLACEMENTS.map(
  (placement) => ({
    objectId: placement.objectId,
    section: placement.section,
    label: placement.label,
    kind: placement.kind,
    contentId: placement.contentId,
  }),
);

const projectTargets: ContentFocusTarget[] = projects.map((project) => ({
  objectId: projectObjectId(project.id),
  section: "projects",
  label: project.title,
  kind: "project",
  contentId: project.id,
}));

const carouselOverviewTarget: ContentFocusTarget = {
  objectId: PROJECT_CAROUSEL_WAYPOINT_ID,
  section: "projects",
  label: "Projects",
  kind: "project",
  contentId: "carousel",
};

const experienceTargets: ContentFocusTarget[] = experience.map((role) => ({
  objectId: experienceObjectId(role.id),
  section: "experience",
  label: role.position,
  kind: "experience",
  contentId: role.id,
}));

const experienceOverviewTarget: ContentFocusTarget = {
  objectId: EXPERIENCE_WAYPOINT_ID,
  section: "experience",
  label: "Experience",
  kind: "experience",
  contentId: "overview",
};

const elevatorOverviewTarget: ContentFocusTarget = {
  objectId: ELEVATOR_WAYPOINT_ID,
  section: "timeline",
  label: "Timeline",
  kind: "timeline",
  contentId: "elevator",
};

const timelineTargets: ContentFocusTarget[] = resolveElevatorLayout(
  "desktop",
).platforms.map((platform) => ({
  objectId: timelineObjectId(platform.id),
  section: "timeline" as const,
  label: platform.title,
  kind: "timeline" as const,
  contentId: platform.id,
}));

const aboutOverviewTarget: ContentFocusTarget = {
  objectId: ABOUT_WAYPOINT_ID,
  section: "about",
  label: "About",
  kind: "about",
  contentId: "profile",
};

const aboutBeatTargets: ContentFocusTarget[] = ABOUT_CHARACTER_CONFIG.beats.map(
  (beat) => ({
    objectId: aboutBeatObjectId(beat.id),
    section: "about" as const,
    label: beat.label,
    kind: "about" as const,
    contentId: beat.id,
  }),
);

export const CONTENT_FOCUS_TARGETS: readonly ContentFocusTarget[] = [
  ...placementTargets,
  aboutOverviewTarget,
  ...aboutBeatTargets,
  carouselOverviewTarget,
  ...projectTargets,
  experienceOverviewTarget,
  ...experienceTargets,
  elevatorOverviewTarget,
  ...timelineTargets,
];

export function findFocusTarget(
  objectId: string,
): ContentFocusTarget | undefined {
  return CONTENT_FOCUS_TARGETS.find((item) => item.objectId === objectId);
}

export function findContentForFocus(
  objectId: string,
): FocusedContent | null {
  if (isAboutObjectId(objectId)) {
    return {
      kind: "about",
      data: profile,
      beatId:
        objectId === ABOUT_WAYPOINT_ID
          ? null
          : aboutBeatIdFromObjectId(objectId),
    };
  }

  const projectId = projectIdFromObjectId(objectId);
  if (projectId) {
    const project = projects.find((item) => item.id === projectId);
    return project ? { kind: "project", data: project } : null;
  }

  if (objectId === EXPERIENCE_WAYPOINT_ID) {
    const defaultRole = experience[0];
    return defaultRole ? { kind: "experience", data: defaultRole } : null;
  }

  const experienceId = experienceIdFromObjectId(objectId);
  if (experienceId) {
    const role = experience.find((item) => item.id === experienceId);
    return role ? { kind: "experience", data: role } : null;
  }

  if (objectId === ELEVATOR_WAYPOINT_ID) {
    const defaultEvent =
      timeline.find((item) => item.id === "2023-mentoring") ?? timeline[0];
    return defaultEvent ? { kind: "timeline", data: defaultEvent } : null;
  }

  const timelineId = timelineIdFromObjectId(objectId);
  if (timelineId) {
    if (timelineId === ELEVATOR_CONFIG.future.id) {
      return {
        kind: "timeline",
        data: {
          id: ELEVATOR_CONFIG.future.id,
          year: new Date().getFullYear() + 1,
          title: ELEVATOR_CONFIG.future.title,
          description: ELEVATOR_CONFIG.future.description,
          category: "goal",
        },
      };
    }
    const event = timeline.find((item) => item.id === timelineId);
    return event ? { kind: "timeline", data: event } : null;
  }

  const placement = findPlacement(objectId);
  if (!placement) {
    return null;
  }

  switch (placement.kind) {
    case "hero":
      return { kind: "hero", data: profile };
    case "project": {
      const project = projects.find((item) => item.id === placement.contentId);
      return project ? { kind: "project", data: project } : null;
    }
    case "skill": {
      const skill = skills.find((item) => item.id === placement.contentId);
      return skill ? { kind: "skill", data: skill } : null;
    }
    case "experience": {
      const role = experience.find((item) => item.id === placement.contentId);
      return role ? { kind: "experience", data: role } : null;
    }
    case "timeline": {
      const event = timeline.find((item) => item.id === placement.contentId);
      return event ? { kind: "timeline", data: event } : null;
    }
    case "certificate": {
      const cert = certificates.find((item) => item.id === placement.contentId);
      return cert ? { kind: "certificate", data: cert } : null;
    }
    case "contact":
      return {
        kind: "contact",
        data: { profile, links: socialLinks },
      };
    default:
      return null;
  }
}
