import type { JSX } from "react";
import { useEffect } from "react";
import { ExperienceCanvas } from "@renderer/ExperienceCanvas";
import { ExperienceHud } from "@components/ui/ExperienceHud";
import { TechnologyPanel } from "@components/ui/TechnologyPanel";
import { TechnologyHiveOverlay } from "@components/ui/TechnologyHiveOverlay";
import { ProjectCaseStudyPanel } from "@components/ui/ProjectCaseStudyPanel";
import { ExperienceRolePanel } from "@components/ui/ExperienceRolePanel";
import { MilestonePanel } from "@components/ui/MilestonePanel";
import { MobileSectionRail } from "@components/ui/MobileSectionRail";
import { MobileMenuButton } from "@components/ui/MobileMenuButton";
import { MobileMenuOverlay } from "@components/ui/MobileMenuOverlay";
import { useKeyboardNavigation } from "@hooks/useKeyboardNavigation";
import { useMobileSwipeNavigation } from "@hooks/useMobileSwipeNavigation";
import { usePrefersReducedMotion } from "@hooks/usePrefersReducedMotion";
import { useViewportSync } from "@hooks/useViewportSync";
import { useWheelNavigation } from "@hooks/useWheelNavigation";
import { CursorManager } from "@interaction/CursorManager";
import { useExperienceStore } from "@store/experienceStore";
import { useViewportStore } from "@store/viewportStore";
import { useTechHiveStore } from "@store/techHiveStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperiencePanelStore } from "@store/experiencePanelStore";

export function App(): JSX.Element {
  usePrefersReducedMotion();
  useKeyboardNavigation();
  useWheelNavigation();
  useMobileSwipeNavigation();
  useViewportSync();

  const hoveredObjectId = useExperienceStore((s) => s.hoveredObjectId);
  const tier = useViewportStore((s) => s.tier);
  const activeSection = useExperienceStore((s) => s.activeSection);
  const selectedTechId = useTechHiveStore((s) => s.selectedTechId);
  const selectedProjectId = useProjectCarouselStore((s) => s.selectedProjectId);
  const selectedEventId = useElevatorStore((s) => s.selectedEventId);
  const selectedExperienceId = useExperiencePanelStore(
    (s) => s.selectedExperienceId,
  );
  const showHiveOverlay =
    tier !== "small" &&
    (activeSection === "skills" || selectedTechId !== null);
  const panelOpen =
    selectedProjectId !== null ||
    selectedExperienceId !== null ||
    selectedEventId !== null ||
    selectedTechId !== null;

  useEffect(() => {
    CursorManager.syncFromHover();
  }, [hoveredObjectId]);

  useEffect(() => {
    return () => {
      CursorManager.reset();
    };
  }, []);

  return (
    <main className="relative h-dvh w-dvw max-w-[100dvw] overflow-hidden bg-[#050508] touch-none select-none">
      <ExperienceCanvas />
      {tier !== "small" && !showHiveOverlay && !panelOpen ? (
        <ExperienceHud />
      ) : null}
      {tier === "small" ? (
        <>
          <MobileMenuButton />
          <MobileMenuOverlay />
          <MobileSectionRail />
        </>
      ) : null}
      <TechnologyPanel />
      <TechnologyHiveOverlay />
      <ProjectCaseStudyPanel />
      <ExperienceRolePanel />
      <MilestonePanel />
    </main>
  );
}
