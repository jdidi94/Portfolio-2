import { EXPLORE_WAYPOINT_ID, WAYPOINTS } from "@config/waypoints";
import { useExperienceStore } from "@store/experienceStore";
import { audioManager } from "@audio/AudioManager";

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
      return;
    }

    store.setMode("transition");
    store.setFocusObjectId(objectId);
    store.setCameraDestinationId(objectId);
    audioManager.play("transition");
  },

  returnToExplore(): void {
    const store = useExperienceStore.getState();

    // Already exploring at origin — no-op (prevents stuck transition).
    if (
      store.cameraDestinationId === EXPLORE_WAYPOINT_ID &&
      store.focusObjectId === null
    ) {
      store.setMode("explore");
      return;
    }

    store.setMode("transition");
    store.setFocusObjectId(null);
    store.setActiveSection("none");
    store.setCameraDestinationId(EXPLORE_WAYPOINT_ID);
    audioManager.play("transition");
  },

  onCameraArrived(): void {
    const store = useExperienceStore.getState();
    if (store.focusObjectId) {
      store.setMode("focus");
      audioManager.play("focus");
      return;
    }
    store.setMode("explore");
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
