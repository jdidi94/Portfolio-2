import { create } from "zustand";

interface ExperiencePanelState {
  /** Open role-panel target. */
  selectedExperienceId: string | null;
  openExperience: (experienceId: string) => void;
  closePanel: () => void;
}

/**
 * Selection for the Experience HTML role panel.
 * Navigation focus stays on the overview waypoint (mirrors project case studies).
 */
export const useExperiencePanelStore = create<ExperiencePanelState>((set) => ({
  selectedExperienceId: null,

  openExperience: (experienceId) =>
    set({ selectedExperienceId: experienceId }),

  closePanel: () => set({ selectedExperienceId: null }),
}));
