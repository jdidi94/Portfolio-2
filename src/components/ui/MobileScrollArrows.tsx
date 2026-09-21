import { useEffect, useState, type JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MOBILE_NAV_CONFIG,
  showsMobileScrollArrows,
} from "@config/mobileNav";
import {
  useMobileActiveRail,
  useMobileNavStore,
} from "@store/mobileNavStore";
import { useExperienceStore } from "@store/experienceStore";
import { useViewportStore } from "@store/viewportStore";
import { useMobileMenuStore } from "@store/mobileMenuStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperiencePanelStore } from "@store/experiencePanelStore";
import { useTechHiveStore } from "@store/techHiveStore";

function ArrowGlyph({
  direction,
}: {
  direction: "up" | "down" | "left" | "right";
}): JSX.Element {
  const rotate =
    direction === "up"
      ? 0
      : direction === "right"
        ? 90
        : direction === "down"
          ? 180
          : 270;

  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

/**
 * Bottom-right swipe guide for About / Projects / Timeline.
 * Appears only after idle (confused visitor); non-interactive.
 */
export function MobileScrollArrows(): JSX.Element | null {
  const tier = useViewportStore((s) => s.tier);
  const rail = useMobileActiveRail();
  const itemIndex = useMobileNavStore((s) => s.itemIndex);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const focusObjectId = useExperienceStore((s) => s.focusObjectId);
  const menuOpen = useMobileMenuStore((s) => s.isOpen);
  const selectedProjectId = useProjectCarouselStore((s) => s.selectedProjectId);
  const selectedEventId = useElevatorStore((s) => s.selectedEventId);
  const selectedExperienceId = useExperiencePanelStore(
    (s) => s.selectedExperienceId,
  );
  const selectedTechId = useTechHiveStore((s) => s.selectedTechId);
  const [visible, setVisible] = useState(false);

  const panelOpen =
    selectedProjectId !== null ||
    selectedEventId !== null ||
    selectedExperienceId !== null ||
    selectedTechId !== null;

  const canHint =
    tier === "small" &&
    rail !== null &&
    focusObjectId !== null &&
    !menuOpen &&
    !panelOpen &&
    showsMobileScrollArrows(rail.sectionId) &&
    rail.itemCount > 1 &&
    rail.axis !== "none";

  // Reset / schedule hint when the rail context changes or after idle.
  useEffect(() => {
    setVisible(false);
    if (!canHint || !rail) {
      return;
    }

    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, MOBILE_NAV_CONFIG.scrollHintIdleMs);

    return () => {
      window.clearTimeout(showTimer);
    };
  }, [canHint, rail?.stopId, rail?.sectionId, itemIndex]);

  // Auto-hide after the guide has been on screen long enough.
  useEffect(() => {
    if (!visible) {
      return;
    }
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, MOBILE_NAV_CONFIG.scrollHintVisibleMs);
    return () => {
      window.clearTimeout(hideTimer);
    };
  }, [visible]);

  if (!canHint || !rail) {
    return null;
  }

  const horizontal = rail.axis === "x";
  const invertedTimeline =
    rail.sectionId === "timeline" && MOBILE_NAV_CONFIG.timelineInvertScroll;
  const hintLabel = horizontal
    ? "Swipe sideways"
    : invertedTimeline
      ? "Swipe up / down"
      : "Swipe up / down";

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key={`${rail.stopId}-scroll-hint`}
          role="status"
          aria-live="polite"
          aria-label={hintLabel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="pointer-events-none absolute right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(4.75rem,calc(env(safe-area-inset-bottom)+3.75rem))] z-20 flex flex-col items-center gap-1 rounded-sm border border-cyan-400/25 bg-black/70 px-2.5 py-2 text-cyan-100/85 backdrop-blur-sm"
        >
          <div className="flex items-center gap-1.5">
            {horizontal ? (
              <>
                <motion.span
                  animate={
                    prefersReducedMotion ? undefined : { x: [0, -3, 0] }
                  }
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowGlyph direction="left" />
                </motion.span>
                <motion.span
                  animate={
                    prefersReducedMotion ? undefined : { x: [0, 3, 0] }
                  }
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.12,
                  }}
                >
                  <ArrowGlyph direction="right" />
                </motion.span>
              </>
            ) : (
              <>
                <motion.span
                  animate={
                    prefersReducedMotion ? undefined : { y: [0, -3, 0] }
                  }
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowGlyph direction="up" />
                </motion.span>
                <motion.span
                  animate={
                    prefersReducedMotion ? undefined : { y: [0, 3, 0] }
                  }
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.12,
                  }}
                >
                  <ArrowGlyph direction="down" />
                </motion.span>
              </>
            )}
          </div>
          <p className="text-[9px] tracking-[0.18em] text-cyan-200/70 uppercase">
            Scroll
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
