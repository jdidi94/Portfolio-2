import { useEffect, useRef } from "react";
import {
  MOBILE_NAV_CONFIG,
  mobileStepDeltaForSwipe,
} from "@config/mobileNav";
import {
  useMobileActiveRail,
  useMobileNavStore,
} from "@store/mobileNavStore";
import { useViewportStore } from "@store/viewportStore";
import { useMobileMenuStore } from "@store/mobileMenuStore";
import { anyPanelOpen, nudgeIfPanelOpen } from "@utils/panelGate";

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

/**
 * Touch swipe → mobileNav.stepItem on small viewports.
 * Axis follows the active rail (x / y / z / page).
 * Timeline vertical swipe is inverted vs About.
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
      if (isUiTouchTarget(event.target)) {
        startRef.current = null;
        return;
      }
      if (useMobileMenuStore.getState().isOpen) {
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
      if (!start || useMobileMenuStore.getState().isOpen) return;

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

      if (anyPanelOpen()) {
        nudgeIfPanelOpen();
        return;
      }

      const now = performance.now();
      if (now - lastStepAtRef.current < MOBILE_NAV_CONFIG.stepCooldownMs) {
        return;
      }
      lastStepAtRef.current = now;

      const axis = rail?.axis ?? "none";
      const sectionId = rail?.sectionId ?? "hero";

      if (axis === "x") {
        if (absX < threshold) return;
        const delta = mobileStepDeltaForSwipe(sectionId, axis, dx, dy);
        if (delta !== null) {
          useMobileNavStore.getState().stepItem(delta);
        }
        return;
      }

      // y / z / page — prefer vertical; allow horizontal fallback.
      if (absY < threshold && axis !== "none") {
        if (absX >= threshold) {
          useMobileNavStore
            .getState()
            .stepItem(mobileStepDeltaForSwipe(sectionId, "x", dx, dy) ?? 0);
        }
        return;
      }

      const delta = mobileStepDeltaForSwipe(sectionId, axis, dx, dy);
      if (delta !== null) {
        useMobileNavStore.getState().stepItem(delta);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [tier, rail?.axis, rail?.sectionId]);
}
