import { useEffect, useRef } from "react";
import { MOBILE_NAV_CONFIG } from "@config/mobileNav";
import { NAVIGATION_CONFIG } from "@config/navigation";
import { NavigationManager } from "@experience/NavigationManager";
import { useMobileNavStore } from "@store/mobileNavStore";
import { useViewportStore } from "@store/viewportStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperiencePanelStore } from "@store/experiencePanelStore";
import { useTechHiveStore } from "@store/techHiveStore";
import { useMobileMenuStore } from "@store/mobileMenuStore";

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

function anyPanelOpen(): boolean {
  return (
    useProjectCarouselStore.getState().selectedProjectId !== null ||
    useElevatorStore.getState().selectedEventId !== null ||
    useExperiencePanelStore.getState().selectedExperienceId !== null ||
    useTechHiveStore.getState().selectedTechId !== null
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
      if (anyPanelOpen() || useMobileMenuStore.getState().isOpen) {
        return;
      }

      const isSmall = useViewportStore.getState().tier === "small";
      const threshold = isSmall
        ? NAVIGATION_CONFIG.wheelThreshold
        : NAVIGATION_CONFIG.wheelThreshold;
      const cooldown = isSmall
        ? MOBILE_NAV_CONFIG.stepCooldownMs
        : NAVIGATION_CONFIG.wheelCooldownMs;

      if (Math.abs(event.deltaY) < threshold && Math.abs(event.deltaX) < threshold) {
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
        useMobileNavStore.getState().stepItem(primary > 0 ? 1 : -1);
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
