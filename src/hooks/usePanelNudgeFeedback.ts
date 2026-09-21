import { useEffect, useRef } from "react";
import { useAnimationControls } from "framer-motion";
import { PANEL_NUDGE_CONFIG } from "@config/navigation";
import { useExperienceStore } from "@store/experienceStore";
import { usePanelNudgeStore } from "@store/panelNudgeStore";

export type PanelCloseHintVariant = "cyan" | "white";

const CLOSE_HINT_CLASS: Record<PanelCloseHintVariant, string> = {
  cyan: "border-cyan-300/40 text-cyan-100",
  white: "border-white/30 text-white",
};

/**
 * Shake the panel shell + pulse Close when panelNudgeStore bumps.
 */
export function usePanelNudgeFeedback(
  closeHintVariant: PanelCloseHintVariant = "cyan",
): {
  shellControls: ReturnType<typeof useAnimationControls>;
  closeHintClass: string;
} {
  const nudgeId = usePanelNudgeStore((s) => s.nudgeId);
  const closeHintActive = usePanelNudgeStore((s) => s.closeHintActive);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const shellControls = useAnimationControls();
  const prevNudgeIdRef = useRef(0);

  useEffect(() => {
    if (nudgeId === 0 || nudgeId === prevNudgeIdRef.current) {
      return;
    }
    prevNudgeIdRef.current = nudgeId;

    if (prefersReducedMotion) {
      return;
    }

    void shellControls.start({
      x: [...PANEL_NUDGE_CONFIG.shakeOffsets],
      transition: { duration: PANEL_NUDGE_CONFIG.shakeSeconds },
    });
  }, [nudgeId, prefersReducedMotion, shellControls]);

  return {
    shellControls,
    closeHintClass: closeHintActive
      ? CLOSE_HINT_CLASS[closeHintVariant]
      : "",
  };
}
