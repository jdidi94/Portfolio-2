import { create } from "zustand";

interface TechHiveState {
  /** Open information panel target. */
  selectedTechId: string | null;
  setSelectedTechId: (id: string | null) => void;
  closePanel: () => void;
}

/**
 * UI selection shared between tech FloatingCards and HTML panel.
 * Animation remains in R3F / Framer Motion — not stored here.
 */
export const useTechHiveStore = create<TechHiveState>((set) => ({
  selectedTechId: null,
  setSelectedTechId: (selectedTechId) => set({ selectedTechId }),
  closePanel: () => set({ selectedTechId: null }),
}));
