import { create } from "zustand";
import { projects } from "@data/projects";

interface ProjectCarouselState {
  /** Open case-study panel target. */
  selectedProjectId: string | null;
  /** Index of the card that should face the camera. */
  frontIndex: number;
  /** Target group Y rotation (radians). Scene tweens toward this. */
  targetRotationY: number;
  /** True while pointer-dragging the ring. */
  isDragging: boolean;
  /** Monotonic stamp bumped on user interaction (pauses idle spin). */
  interactionEpoch: number;
  openProject: (projectId: string) => void;
  closeCaseStudy: () => void;
  setFrontIndex: (index: number) => void;
  step: (delta: number) => void;
  rotateBy: (deltaRadians: number) => void;
  setDragging: (dragging: boolean) => void;
  touchInteraction: () => void;
}

function clampIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return ((index % count) + count) % count;
}

function rotationForIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return -((Math.PI * 2 * index) / count);
}

/**
 * Selection + target angle for the Project Carousel.
 * Continuous idle / drag motion stays in R3F refs — not here.
 */
export const useProjectCarouselStore = create<ProjectCarouselState>((set, get) => ({
  selectedProjectId: null,
  frontIndex: 0,
  targetRotationY: 0,
  isDragging: false,
  interactionEpoch: 0,

  openProject: (projectId) => {
    const count = projects.length;
    const index = projects.findIndex((item) => item.id === projectId);
    if (index < 0) return;
    set({
      selectedProjectId: projectId,
      frontIndex: index,
      targetRotationY: rotationForIndex(index, count),
      interactionEpoch: get().interactionEpoch + 1,
    });
  },

  closeCaseStudy: () => set({ selectedProjectId: null }),

  setFrontIndex: (index) => {
    const count = projects.length;
    const next = clampIndex(index, count);
    set({
      frontIndex: next,
      targetRotationY: rotationForIndex(next, count),
      interactionEpoch: get().interactionEpoch + 1,
    });
  },

  step: (delta) => {
    const count = projects.length;
    if (count <= 0) return;
    const next = clampIndex(get().frontIndex + delta, count);
    set({
      frontIndex: next,
      targetRotationY: rotationForIndex(next, count),
      interactionEpoch: get().interactionEpoch + 1,
    });
  },

  rotateBy: (deltaRadians) => {
    set({
      targetRotationY: get().targetRotationY + deltaRadians,
      interactionEpoch: get().interactionEpoch + 1,
    });
  },

  setDragging: (isDragging) =>
    set({
      isDragging,
      interactionEpoch: get().interactionEpoch + 1,
    }),

  touchInteraction: () =>
    set({ interactionEpoch: get().interactionEpoch + 1 }),
}));
