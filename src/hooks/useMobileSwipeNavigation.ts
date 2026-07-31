import { useEffect, useRef } from "react";
import { MOBILE_NAV_CONFIG } from "@config/mobileNav";
import {
  useMobileActiveRail,
  useMobileNavStore,
} from "@store/mobileNavStore";
import { useViewportStore } from "@store/viewportStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperiencePanelStore } from "@store/experiencePanelStore";
import { useTechHiveStore } from "@store/techHiveStore";
import { useMobileMenuStore } from "@store/mobileMenuStore";

function isUiTouchTarget(target: EventTarget | null): boolean {
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

function navigationBlocked(): boolean {
  return anyPanelOpen() || useMobileMenuStore.getState().isOpen;
}

/**
 * Touch swipe → mobileNav.stepItem on small viewports.
 * Axis follows the active rail (x / y / z / page).
 */
export function useMobileSwipeNavigation(): void {
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const lastStepAtRef = useRef(0);
  const tier = useViewportStore((s) => s.tier);
  const rail = useMobileActiveRail();

  useEffect(() => {
    if (tier !== "small") {
      return;
    }

    const onTouchStart = (event: TouchEvent): void => {
      if (isUiTouchTarget(event.target) || navigationBlocked()) {
        startRef.current = null;
        return;
      }
      const touch = event.touches[0];
      if (!touch) return;
      startRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchEnd = (event: TouchEvent): void => {
      const start = startRef.current;
      startRef.current = null;
      if (!start || navigationBlocked()) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const threshold = MOBILE_NAV_CONFIG.swipeThresholdPx;

      if (absX < threshold && absY < threshold) {
        return;
      }

      const now = performance.now();
      if (now - lastStepAtRef.current < MOBILE_NAV_CONFIG.stepCooldownMs) {
        return;
      }
      lastStepAtRef.current = now;

      const axis = rail?.axis ?? "none";
      if (axis === "x") {
        if (absX < threshold) return;
        // Swipe left → next item (finger moves left, content advances).
        useMobileNavStore.getState().stepItem(dx < 0 ? 1 : -1);
        return;
      }

      // y / z / page / none — vertical metaphor.
      if (absY < threshold && axis !== "none") {
        if (absX >= threshold) {
          useMobileNavStore.getState().stepItem(dx < 0 ? 1 : -1);
        }
        return;
      }
      useMobileNavStore.getState().stepItem(dy < 0 ? 1 : -1);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [tier, rail?.axis]);
}
