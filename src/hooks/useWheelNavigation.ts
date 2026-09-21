import { useEffect, useRef } from "react";
import {
  MOBILE_NAV_CONFIG,
  mobileRailForStopId,
  mobileStepDeltaForWheel,
} from "@config/mobileNav";
import { NAVIGATION_CONFIG } from "@config/navigation";
import { NavigationManager } from "@experience/NavigationManager";
import { sectionStopForObjectId } from "@config/sections";
import { useMobileNavStore } from "@store/mobileNavStore";
import { useExperienceStore } from "@store/experienceStore";
import { useViewportStore } from "@store/viewportStore";
import { useMobileMenuStore } from "@store/mobileMenuStore";
import { anyPanelOpen, nudgeIfPanelOpen } from "@utils/panelGate";

function isUiScrollTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }
  return Boolean(
    target.closest(
      "button, input, textarea, select, aside, a, [data-allow-scroll]",
    ),
  );
}

/**
 * Mouse / trackpad wheel — section bands on mid/desktop; item rails on small.
 */
export function useWheelNavigation(): void {
  const lastStepAtRef = useRef(0);

  useEffect(() => {
    const onWheel = (event: WheelEvent): void => {
      if (isUiScrollTarget(event.target)) {
        return;
      }
      if (useMobileMenuStore.getState().isOpen) {
        return;
      }
      if (anyPanelOpen()) {
        const threshold = NAVIGATION_CONFIG.wheelThreshold;
        if (
          Math.abs(event.deltaY) >= threshold ||
          Math.abs(event.deltaX) >= threshold
        ) {
          event.preventDefault();
          nudgeIfPanelOpen();
        }
        return;
      }

      const isSmall = useViewportStore.getState().tier === "small";
      const threshold = NAVIGATION_CONFIG.wheelThreshold;
      const cooldown = isSmall
        ? MOBILE_NAV_CONFIG.stepCooldownMs
        : NAVIGATION_CONFIG.wheelCooldownMs;

      if (
        Math.abs(event.deltaY) < threshold &&
        Math.abs(event.deltaX) < threshold
      ) {
        return;
      }

      const now = performance.now();
      if (now - lastStepAtRef.current < cooldown) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      lastStepAtRef.current = now;

      if (isSmall) {
        const primary =
          Math.abs(event.deltaY) >= Math.abs(event.deltaX)
            ? event.deltaY
            : event.deltaX;
        const focusObjectId = useExperienceStore.getState().focusObjectId;
        const stopId =
          focusObjectId !== null
            ? (sectionStopForObjectId(focusObjectId) ?? focusObjectId)
            : null;
        const sectionId =
          stopId !== null
            ? (mobileRailForStopId(stopId)?.sectionId ?? "hero")
            : "hero";
        useMobileNavStore
          .getState()
          .stepItem(mobileStepDeltaForWheel(sectionId, primary));
        return;
      }

      if (event.deltaY > 0) {
        NavigationManager.stepForward();
      } else {
        NavigationManager.stepBackward();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, []);
}
