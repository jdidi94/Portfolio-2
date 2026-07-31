import type { ExperienceSection } from "@experience/ExperienceState";
import { sectionForObjectId } from "@config/sections";
import { useExperienceStore } from "@store/experienceStore";

/** Activates portfolio sections from focus targets. */
export const SectionManager = {
  activate(section: ExperienceSection): void {
    useExperienceStore.getState().setActiveSection(section);
  },

  activateFromObjectId(objectId: string): void {
    const section = sectionForObjectId(objectId);
    useExperienceStore.getState().setActiveSection(section);
  },

  clear(): void {
    useExperienceStore.getState().setActiveSection("none");
  },
} as const;
