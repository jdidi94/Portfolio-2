import type { ExperienceSection } from "@experience/ExperienceState";
import { useExperienceStore } from "@store/experienceStore";

/** Placeholder section activation for later content phases. */
export const SectionManager = {
  activate(section: ExperienceSection): void {
    useExperienceStore.getState().setActiveSection(section);
  },

  clear(): void {
    useExperienceStore.getState().setActiveSection("none");
  },
} as const;
