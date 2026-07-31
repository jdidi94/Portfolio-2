import { create } from "zustand";
import {
  experienceForSize,
  type ViewportExperienceConfig,
  type ViewportTier,
} from "@config/viewport";

interface ViewportStore extends ViewportExperienceConfig {
  tier: ViewportTier;
  isPortrait: boolean;
  width: number;
  height: number;
  syncFromWindow: () => void;
}

function snapshot(
  width: number,
  height: number,
): Omit<ViewportStore, "syncFromWindow"> {
  const resolved = experienceForSize(width, height);
  return {
    ...resolved,
    width,
    height,
  };
}

const initialWidth =
  typeof window !== "undefined" ? window.innerWidth : 1280;
const initialHeight =
  typeof window !== "undefined" ? window.innerHeight : 800;

export const useViewportStore = create<ViewportStore>((set) => ({
  ...snapshot(initialWidth, initialHeight),
  syncFromWindow: () => {
    set(snapshot(window.innerWidth, window.innerHeight));
  },
}));
