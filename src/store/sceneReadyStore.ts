import { create } from "zustand";

interface SceneReadyState {
  /** True once SceneRoot content has mounted for this session. */
  isSceneMounted: boolean;
  markSceneMounted: () => void;
  reset: () => void;
}

/**
 * Bridges R3F mount → HTML boot overlay.
 * Keeps the loading screen up until the corridor sections exist.
 */
export const useSceneReadyStore = create<SceneReadyState>((set) => ({
  isSceneMounted: false,
  markSceneMounted: () => set({ isSceneMounted: true }),
  reset: () => set({ isSceneMounted: false }),
}));
