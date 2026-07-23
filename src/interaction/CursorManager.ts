import { useExperienceStore } from "@store/experienceStore";

export type CursorKind = "default" | "pointer";

export const CursorManager = {
  syncFromHover(): void {
    const hovered = useExperienceStore.getState().hoveredObjectId;
    document.body.style.cursor = hovered ? "pointer" : "default";
  },

  set(kind: CursorKind): void {
    document.body.style.cursor = kind;
  },

  reset(): void {
    document.body.style.cursor = "default";
  },
} as const;
