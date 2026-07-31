import { ExperienceManager } from "@experience/ExperienceManager";
import { SectionManager } from "@experience/SectionManager";
import type {
  InteractionEvent,
  InteractionListener,
} from "@interaction/Events";
import { useTechHiveStore } from "@store/techHiveStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperiencePanelStore } from "@store/experiencePanelStore";
import { useViewportStore } from "@store/viewportStore";
import { techIdFromObjectId } from "@utils/techIds";
import {
  PROJECT_CAROUSEL_WAYPOINT_ID,
  projectIdFromObjectId,
} from "@utils/projectIds";
import {
  ELEVATOR_DETAIL_WAYPOINT_ID,
  timelineIdFromObjectId,
} from "@utils/elevatorIds";
import {
  EXPERIENCE_WAYPOINT_ID,
  experienceIdFromObjectId,
} from "@utils/experienceIds";
import { audioManager } from "@audio/AudioManager";

const listeners = new Set<InteractionListener>();

export const InteractionManager = {
  subscribe(listener: InteractionListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  emit(event: InteractionEvent): void {
    listeners.forEach((listener) => {
      listener(event);
    });
  },

  onHover(objectId: string): void {
    ExperienceManager.setHover(objectId);
    InteractionManager.emit({ type: "hover", objectId });
  },

  onUnhover(objectId: string): void {
    ExperienceManager.setHover(null);
    InteractionManager.emit({ type: "unhover", objectId });
  },

  onSelect(objectId: string): void {
    const isSmall = useViewportStore.getState().tier === "small";

    const techId = techIdFromObjectId(objectId);
    if (techId) {
      useProjectCarouselStore.getState().closeCaseStudy();
      useElevatorStore.getState().closePanel();
      useExperiencePanelStore.getState().closePanel();
      useTechHiveStore.getState().setSelectedTechId(techId);
      SectionManager.activate("skills");
      InteractionManager.emit({ type: "select", objectId });
      return;
    }

    const projectId = projectIdFromObjectId(objectId);
    if (projectId) {
      useTechHiveStore.getState().closePanel();
      useElevatorStore.getState().closePanel();
      useExperiencePanelStore.getState().closePanel();
      useProjectCarouselStore.getState().openProject(projectId);
      if (!isSmall) {
        ExperienceManager.focusObject(PROJECT_CAROUSEL_WAYPOINT_ID);
      }
      SectionManager.activate("projects");
      audioManager.play("focus");
      InteractionManager.emit({ type: "select", objectId });
      return;
    }

    const experienceId = experienceIdFromObjectId(objectId);
    if (experienceId) {
      useTechHiveStore.getState().closePanel();
      useProjectCarouselStore.getState().closeCaseStudy();
      useElevatorStore.getState().closePanel();
      useExperiencePanelStore.getState().openExperience(experienceId);
      if (!isSmall) {
        ExperienceManager.focusObject(EXPERIENCE_WAYPOINT_ID);
      }
      SectionManager.activate("experience");
      audioManager.play("focus");
      InteractionManager.emit({ type: "select", objectId });
      return;
    }

    const timelineId = timelineIdFromObjectId(objectId);
    if (timelineId) {
      useTechHiveStore.getState().closePanel();
      useProjectCarouselStore.getState().closeCaseStudy();
      useExperiencePanelStore.getState().closePanel();
      useElevatorStore.getState().openMilestone(timelineId);
      if (!isSmall) {
        ExperienceManager.focusObject(ELEVATOR_DETAIL_WAYPOINT_ID);
      }
      SectionManager.activate("timeline");
      audioManager.play("focus");
      InteractionManager.emit({ type: "select", objectId });
      return;
    }

    // Small: scroll owns camera — ignore background card selects.
    if (isSmall) {
      InteractionManager.emit({ type: "select", objectId });
      return;
    }

    useTechHiveStore.getState().closePanel();
    useProjectCarouselStore.getState().closeCaseStudy();
    useElevatorStore.getState().closePanel();
    useExperiencePanelStore.getState().closePanel();
    ExperienceManager.focusObject(objectId);
    InteractionManager.emit({ type: "select", objectId });
  },
} as const;
