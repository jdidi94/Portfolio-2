import { create } from "zustand";
import { EXPLORE_WAYPOINT_ID } from "@config/waypoints";
import type {
  ExperienceSection,
  ExperienceState,
  NavigationMode,
} from "@experience/ExperienceState";

interface ExperienceStore extends ExperienceState {
  setMode: (mode: NavigationMode) => void;
  setActiveSection: (section: ExperienceSection) => void;
  setFocusObjectId: (id: string | null) => void;
  setCameraDestinationId: (id: string) => void;
  setHoveredObjectId: (id: string | null) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setPrefersReducedMotion: (value: boolean) => void;
  resetToExplore: () => void;
}

const initialState: ExperienceState = {
  mode: "explore",
  activeSection: "none",
  focusObjectId: null,
  cameraDestinationId: EXPLORE_WAYPOINT_ID,
  hoveredObjectId: null,
  isAudioEnabled: false,
  prefersReducedMotion: false,
};

export const useExperienceStore = create<ExperienceStore>((set) => ({
  ...initialState,
  setMode: (mode) => set({ mode }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setFocusObjectId: (focusObjectId) => set({ focusObjectId }),
  setCameraDestinationId: (cameraDestinationId) =>
    set({ cameraDestinationId }),
  setHoveredObjectId: (hoveredObjectId) => set({ hoveredObjectId }),
  setAudioEnabled: (isAudioEnabled) => set({ isAudioEnabled }),
  setPrefersReducedMotion: (prefersReducedMotion) =>
    set({ prefersReducedMotion }),
  resetToExplore: () =>
    set({
      mode: "explore",
      activeSection: "none",
      focusObjectId: null,
      cameraDestinationId: EXPLORE_WAYPOINT_ID,
    }),
}));
