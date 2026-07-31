import { EXPLORE_WAYPOINT_ID, WAYPOINTS } from "@config/waypoints";
import { useExperienceStore } from "@store/experienceStore";
import { useTechHiveStore } from "@store/techHiveStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperiencePanelStore } from "@store/experiencePanelStore";
import { useMobileNavStore } from "@store/mobileNavStore";
import { audioManager } from "@audio/AudioManager";
import { SectionManager } from "@experience/SectionManager";
import type { MobileCameraTarget } from "@store/mobileNavStore";

/** Director API for navigation and focus — no React required. */
export const ExperienceManager = {
  focusObject(objectId: string): void {
    const waypoint = WAYPOINTS.find((item) => item.id === objectId);
    if (!waypoint) {
      return;
    }

    const store = useExperienceStore.getState();

    // Already focused on this target — avoid stuck transition with no tween.
    if (
      store.cameraDestinationId === objectId &&
      store.focusObjectId === objectId
    ) {
      store.setMode("focus");
      SectionManager.activateFromObjectId(objectId);
      return;
    }

    store.setMode("transition");
    store.setFocusObjectId(objectId);
    store.setCameraDestinationId(objectId);
    audioManager.play("transition");
  },

  /**
   * Small-viewport focus — camera target comes from mobileNavStore framing,
   * not necessarily a static WAYPOINTS entry.
   * `instant` skips the GSAP travel when swapping cards inside one section.
   */
  focusMobileTarget(
    target: MobileCameraTarget,
    options?: { instant?: boolean },
  ): void {
    const store = useExperienceStore.getState();
    const instant = options?.instant === true;

    if (
      store.cameraDestinationId === target.objectId &&
      store.focusObjectId === target.objectId
    ) {
      store.setMode("focus");
      SectionManager.activateFromObjectId(target.objectId);
      return;
    }

    store.setFocusObjectId(target.objectId);
    store.setCameraDestinationId(target.objectId);

    if (instant) {
      // Same-section carousel step — no camera travel, still cue item change.
      store.setMode("focus");
      SectionManager.activateFromObjectId(target.objectId);
      audioManager.play("focus");
      return;
    }

    store.setMode("transition");
    audioManager.play("transition");
  },

  returnToExplore(): void {
    useTechHiveStore.getState().closePanel();
    useProjectCarouselStore.getState().closeCaseStudy();
    useElevatorStore.getState().closePanel();
    useExperiencePanelStore.getState().closePanel();
    const store = useExperienceStore.getState();

    if (
      store.cameraDestinationId === EXPLORE_WAYPOINT_ID &&
      store.focusObjectId === null
    ) {
      store.setMode("explore");
      SectionManager.clear();
      return;
    }

    store.setMode("transition");
    store.setFocusObjectId(null);
    store.setActiveSection("none");
    store.setCameraDestinationId(EXPLORE_WAYPOINT_ID);
    useMobileNavStore.setState({ cameraTarget: null, itemIndex: 0 });
    audioManager.play("transition");
  },

  onCameraArrived(): void {
    const store = useExperienceStore.getState();
    if (store.focusObjectId) {
      store.setMode("focus");
      SectionManager.activateFromObjectId(store.focusObjectId);
      audioManager.play("focus");
      return;
    }
    store.setMode("explore");
    SectionManager.clear();
  },

  setHover(objectId: string | null): void {
    const store = useExperienceStore.getState();
    if (store.hoveredObjectId === objectId) {
      return;
    }
    store.setHoveredObjectId(objectId);
    if (objectId) {
      audioManager.play("hover");
    }
  },
} as const;
