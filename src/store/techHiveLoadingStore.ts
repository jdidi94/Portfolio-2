import { create } from "zustand";

interface TechHiveLoadingState {
  isLoading: boolean;
  beginLoading: () => void;
  endLoading: () => void;
}

/**
 * Bridges R3F Suspense (tech icon textures) to the HTML loading overlay.
 */
export const useTechHiveLoadingStore = create<TechHiveLoadingState>((set) => ({
  isLoading: false,
  beginLoading: () => set({ isLoading: true }),
  endLoading: () => set({ isLoading: false }),
}));
