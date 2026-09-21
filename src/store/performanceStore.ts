import { create } from "zustand";
import {
  PERFORMANCE_CONFIG,
  type PerformanceQuality,
} from "@config/performance";

interface PerformanceStore {
  quality: PerformanceQuality;
  /** Live 0–1 factor from PerformanceMonitor (1 = full budget). */
  factor: number;
  /** Locked after repeated flipflops — stay on low until reload. */
  fallback: boolean;
  setFactor: (factor: number) => void;
  setQuality: (quality: PerformanceQuality) => void;
  markFallback: () => void;
}

export const usePerformanceStore = create<PerformanceStore>((set) => ({
  quality: PERFORMANCE_CONFIG.defaultQuality,
  factor: 1,
  fallback: false,
  setFactor: (factor) => {
    set((state) => {
      if (state.fallback) {
        return { factor };
      }
      return {
        factor,
        quality: PERFORMANCE_CONFIG.qualityFromFactor(factor),
      };
    });
  },
  setQuality: (quality) => set({ quality }),
  markFallback: () =>
    set({
      fallback: true,
      quality: "low",
      factor: 0,
    }),
}));
