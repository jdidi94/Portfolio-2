import { useElevatorStore } from "@store/elevatorStore";
import { useExperiencePanelStore } from "@store/experiencePanelStore";
import { usePanelNudgeStore } from "@store/panelNudgeStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useTechHiveStore } from "@store/techHiveStore";

/** True when any HTML detail panel is open. */
export function anyPanelOpen(): boolean {
  return (
    useProjectCarouselStore.getState().selectedProjectId !== null ||
    useElevatorStore.getState().selectedEventId !== null ||
    useExperiencePanelStore.getState().selectedExperienceId !== null ||
    useTechHiveStore.getState().selectedTechId !== null
  );
}

/**
 * If a detail panel is open, bump the reject nudge and return true.
 * Callers should keep navigation blocked when this returns true.
 */
export function nudgeIfPanelOpen(): boolean {
  if (!anyPanelOpen()) {
    return false;
  }
  usePanelNudgeStore.getState().bump();
  return true;
}
