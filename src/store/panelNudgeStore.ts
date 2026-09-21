import { create } from "zustand";
import { PANEL_NUDGE_CONFIG } from "@config/navigation";

interface PanelNudgeState {
  /** Increments on each reject so panels re-trigger shake. */
  nudgeId: number;
  /** True while Close should look hovered. */
  closeHintActive: boolean;
  bump: () => void;
}

let hintTimer: ReturnType<typeof setTimeout> | null = null;
let lastBumpAt = 0;

/**
 * Signal when journey navigation is blocked by an open HTML panel.
 * Animation stays in Framer Motion / the panel hooks — not stored here.
 */
export const usePanelNudgeStore = create<PanelNudgeState>((set) => ({
  nudgeId: 0,
  closeHintActive: false,

  bump: () => {
    const now = performance.now();
    if (now - lastBumpAt < PANEL_NUDGE_CONFIG.debounceMs) {
      return;
    }
    lastBumpAt = now;

    if (hintTimer !== null) {
      clearTimeout(hintTimer);
      hintTimer = null;
    }

    set((state) => ({
      nudgeId: state.nudgeId + 1,
      closeHintActive: true,
    }));

    hintTimer = setTimeout(() => {
      hintTimer = null;
      usePanelNudgeStore.setState({ closeHintActive: false });
    }, PANEL_NUDGE_CONFIG.closeHintMs);
  },
}));
