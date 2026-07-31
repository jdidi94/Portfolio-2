import type { JSX } from "react";
import { SECTION_NAV_STOPS } from "@config/sections";
import {
  useMobileActiveRail,
  useMobileNavStore,
} from "@store/mobileNavStore";
import { useExperienceStore } from "@store/experienceStore";
import { useViewportStore } from "@store/viewportStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperiencePanelStore } from "@store/experiencePanelStore";
import { useTechHiveStore } from "@store/techHiveStore";
import { useMobileMenuStore } from "@store/mobileMenuStore";

/**
 * Small-viewport section chrome — Back / Skip jump by section only.
 */
export function MobileSectionRail(): JSX.Element | null {
  const tier = useViewportStore((s) => s.tier);
  const rail = useMobileActiveRail();
  const itemIndex = useMobileNavStore((s) => s.itemIndex);
  const goNextSection = useMobileNavStore((s) => s.goNextSection);
  const goPrevSection = useMobileNavStore((s) => s.goPrevSection);
  const focusObjectId = useExperienceStore((s) => s.focusObjectId);
  const menuOpen = useMobileMenuStore((s) => s.isOpen);
  const selectedProjectId = useProjectCarouselStore((s) => s.selectedProjectId);
  const selectedEventId = useElevatorStore((s) => s.selectedEventId);
  const selectedExperienceId = useExperiencePanelStore(
    (s) => s.selectedExperienceId,
  );
  const selectedTechId = useTechHiveStore((s) => s.selectedTechId);

  if (tier !== "small" || !rail || focusObjectId === null || menuOpen) {
    return null;
  }

  const panelOpen =
    selectedProjectId !== null ||
    selectedEventId !== null ||
    selectedExperienceId !== null ||
    selectedTechId !== null;

  if (panelOpen) {
    return null;
  }

  const isFirstSection = rail.stopIndex === 0;
  const isLastSection = rail.stopIndex >= SECTION_NAV_STOPS.length - 1;
  const progressLabel =
    rail.itemCount > 1 ? `${itemIndex + 1} / ${rail.itemCount}` : null;

  return (
    <nav
      aria-label="Section navigation"
      className="pointer-events-auto absolute inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 flex items-end justify-between gap-3 px-3"
    >
      <div className="min-w-[4.5rem]">
        {!isFirstSection ? (
          <button
            type="button"
            onClick={goPrevSection}
            className="rounded-sm border border-white/15 bg-black/70 px-3 py-2 text-xs tracking-wide text-white/80 backdrop-blur-sm transition hover:border-cyan-300/40 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70"
          >
            Back
          </button>
        ) : null}
      </div>

      <div className="flex flex-col items-center gap-0.5 text-center">
        <p className="text-[10px] tracking-[0.28em] text-cyan-200/75 uppercase">
          {rail.label}
        </p>
        {progressLabel ? (
          <p className="font-mono text-[10px] text-white/45">{progressLabel}</p>
        ) : null}
      </div>

      <div className="flex min-w-[4.5rem] justify-end">
        {!isLastSection ? (
          <button
            type="button"
            onClick={goNextSection}
            className="rounded-sm border border-cyan-400/35 bg-cyan-500/15 px-3 py-2 text-xs tracking-wide text-cyan-100 backdrop-blur-sm transition hover:border-cyan-300/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70"
          >
            Skip
          </button>
        ) : null}
      </div>
    </nav>
  );
}
