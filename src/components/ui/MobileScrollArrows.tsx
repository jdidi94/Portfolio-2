import type { JSX } from "react";
import { motion } from "framer-motion";
import {
  mobileStepDeltaForArrow,
  showsMobileScrollArrows,
  MOBILE_NAV_CONFIG,
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
      width={18}
      height={18}
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
 * Swipe-direction arrows for About, Projects, and Timeline on small.
 * Buttons step the rail the same way the matching swipe would.
 */
export function MobileScrollArrows(): JSX.Element | null {
  const tier = useViewportStore((s) => s.tier);
  const rail = useMobileActiveRail();
  const stepItem = useMobileNavStore((s) => s.stepItem);
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

  const panelOpen =
    selectedProjectId !== null ||
    selectedEventId !== null ||
    selectedExperienceId !== null ||
    selectedTechId !== null;

  if (
    tier !== "small" ||
    !rail ||
    focusObjectId === null ||
    menuOpen ||
    panelOpen ||
    !showsMobileScrollArrows(rail.sectionId) ||
    rail.itemCount <= 1 ||
    rail.axis === "none"
  ) {
    return null;
  }

  const horizontal = rail.axis === "x";
  const invertedTimeline =
    rail.sectionId === "timeline" &&
    MOBILE_NAV_CONFIG.timelineInvertScroll;
  const primaryDir = horizontal ? "left" : "up";
  const secondaryDir = horizontal ? "right" : "down";
  const primaryLabel = horizontal
    ? "Next item"
    : invertedTimeline
      ? "Previous milestone"
      : "Next item";
  const secondaryLabel = horizontal
    ? "Previous item"
    : invertedTimeline
      ? "Next milestone"
      : "Previous item";

  const bounce = prefersReducedMotion
    ? undefined
    : horizontal
      ? { x: [0, -5, 0] }
      : { y: [0, -5, 0] };
  const bounceOpposite = prefersReducedMotion
    ? undefined
    : horizontal
      ? { x: [0, 5, 0] }
      : { y: [0, 5, 0] };

  const buttonClass =
    "pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/35 bg-black/65 text-cyan-100/90 backdrop-blur-sm transition hover:border-cyan-300/55 hover:bg-cyan-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70";

  return (
    <div
      role="group"
      aria-label="Item scroll hints"
      className={`pointer-events-none absolute z-20 flex ${
        horizontal
          ? "inset-y-0 left-0 right-0 items-center justify-between px-2"
          : "inset-x-0 top-[max(4.5rem,env(safe-area-inset-top))] bottom-[max(4.5rem,env(safe-area-inset-bottom))] flex-col items-center justify-between py-2"
      }`}
    >
      <motion.button
        type="button"
        aria-label={primaryLabel}
        className={buttonClass}
        animate={bounce}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 1.35, repeat: Infinity, ease: "easeInOut" }
        }
        onClick={() => {
          stepItem(
            mobileStepDeltaForArrow(rail.sectionId, rail.axis, true),
          );
        }}
      >
        <ArrowGlyph direction={primaryDir} />
      </motion.button>

      <motion.button
        type="button"
        aria-label={secondaryLabel}
        className={buttonClass}
        animate={bounceOpposite}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 1.35, repeat: Infinity, ease: "easeInOut", delay: 0.15 }
        }
        onClick={() => {
          stepItem(
            mobileStepDeltaForArrow(rail.sectionId, rail.axis, false),
          );
        }}
      >
        <ArrowGlyph direction={secondaryDir} />
      </motion.button>
    </div>
  );
}
