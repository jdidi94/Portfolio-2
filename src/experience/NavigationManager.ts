import {
  SECTION_NAV_STOPS,
  sectionStopForObjectId,
} from "@config/sections";
import { ExperienceManager } from "@experience/ExperienceManager";
import { useExperienceStore } from "@store/experienceStore";
import { useTechHiveStore } from "@store/techHiveStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperiencePanelStore } from "@store/experiencePanelStore";

function canNavigate(): boolean {
  return useExperienceStore.getState().mode !== "transition";
}

/**
 * Index into SECTION_NAV_STOPS for the current focus.
 * Sibling cards map to their section stop so wheel/arrows jump band-to-band.
 */
function currentSectionStopIndex(): number {
  const currentId = useExperienceStore.getState().focusObjectId;
  if (currentId === null) {
    return -1;
  }
  const stopId = sectionStopForObjectId(currentId) ?? currentId;
  return SECTION_NAV_STOPS.indexOf(stopId);
}

function focusSectionStop(stopId: string): void {
  useTechHiveStore.getState().closePanel();
  useProjectCarouselStore.getState().closeCaseStudy();
  useElevatorStore.getState().closePanel();
  useExperiencePanelStore.getState().closePanel();
  ExperienceManager.focusObject(stopId);
}

/**
 * Section-band travel along the depth corridor.
 * Click still focuses individual cards; scroll/arrows move between sections.
 */
export const NavigationManager = {
  /** Deeper into the corridor (next section / first section from home). */
  stepForward(): void {
    if (!canNavigate()) {
      return;
    }

    if (SECTION_NAV_STOPS.length === 0) {
      return;
    }

    const currentId = useExperienceStore.getState().focusObjectId;
    if (currentId === null) {
      focusSectionStop(SECTION_NAV_STOPS[0]);
      return;
    }

    const index = currentSectionStopIndex();
    if (index < 0 || index >= SECTION_NAV_STOPS.length - 1) {
      return;
    }
    focusSectionStop(SECTION_NAV_STOPS[index + 1]);
  },

  /** Toward the camera / previous section; from the first stop returns home. */
  stepBackward(): void {
    if (!canNavigate()) {
      return;
    }

    const currentId = useExperienceStore.getState().focusObjectId;
    if (currentId === null) {
      return;
    }

    const index = currentSectionStopIndex();
    if (index <= 0) {
      NavigationManager.goHome();
      return;
    }
    focusSectionStop(SECTION_NAV_STOPS[index - 1]);
  },

  goPrevious(): void {
    NavigationManager.stepBackward();
  },

  goHome(): void {
    if (!canNavigate()) {
      return;
    }
    ExperienceManager.returnToExplore();
  },

  focusNext(): void {
    NavigationManager.stepForward();
  },

  focusPrevious(): void {
    NavigationManager.stepBackward();
  },

  escape(): void {
    NavigationManager.goHome();
  },
} as const;
