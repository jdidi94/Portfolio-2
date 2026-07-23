import { WAYPOINTS } from "@config/waypoints";
import { ExperienceManager } from "@experience/ExperienceManager";
import { useExperienceStore } from "@store/experienceStore";

export const NavigationManager = {
  focusNext(): void {
    const focusable = WAYPOINTS.filter((wp) => wp.id !== "origin");
    if (focusable.length === 0) {
      return;
    }

    const currentId = useExperienceStore.getState().focusObjectId;
    const currentIndex = focusable.findIndex((wp) => wp.id === currentId);
    const nextIndex =
      currentIndex < 0 ? 0 : (currentIndex + 1) % focusable.length;
    ExperienceManager.focusObject(focusable[nextIndex].id);
  },

  focusPrevious(): void {
    const focusable = WAYPOINTS.filter((wp) => wp.id !== "origin");
    if (focusable.length === 0) {
      return;
    }

    const currentId = useExperienceStore.getState().focusObjectId;
    const currentIndex = focusable.findIndex((wp) => wp.id === currentId);
    const previousIndex =
      currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1;
    ExperienceManager.focusObject(focusable[previousIndex].id);
  },

  escape(): void {
    ExperienceManager.returnToExplore();
  },
} as const;
