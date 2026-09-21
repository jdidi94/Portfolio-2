import type { JSX, ReactNode } from "react";
import { Suspense, lazy, useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { ExperienceHud } from "@components/ui/ExperienceHud";
import { TechnologyPanel } from "@components/ui/TechnologyPanel";
import { TechnologyHiveOverlay } from "@components/ui/TechnologyHiveOverlay";
import { ProjectCaseStudyPanel } from "@components/ui/ProjectCaseStudyPanel";
import { ExperienceRolePanel } from "@components/ui/ExperienceRolePanel";
import { MilestonePanel } from "@components/ui/MilestonePanel";
import { MobileSectionRail } from "@components/ui/MobileSectionRail";
import { MobileMenuButton } from "@components/ui/MobileMenuButton";
import { MobileMenuOverlay } from "@components/ui/MobileMenuOverlay";
import { AppLoadingScreen } from "@components/ui/AppLoadingScreen";
import { TechHiveLoadingOverlay } from "@components/ui/TechHiveLoadingOverlay";
import { ContactFaceLinksTuningPanel } from "@components/ui/ContactFaceLinksTuningPanel";
import { NavigationGuideOverlay } from "@components/ui/NavigationGuideOverlay";
import { DEV_TOOLS_CONFIG } from "@config/devTools";
import { useKeyboardNavigation } from "@hooks/useKeyboardNavigation";
import { useMobileSwipeNavigation } from "@hooks/useMobileSwipeNavigation";
import { useMobileExperienceBootstrap } from "@hooks/useMobileExperienceBootstrap";
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
import { useTechHiveLoadingStore } from "@store/techHiveLoadingStore";
import { useSceneReadyStore } from "@store/sceneReadyStore";

const ExperienceCanvas = lazy(async () => {
  const module = await import("@renderer/ExperienceCanvas");
  return { default: module.ExperienceCanvas };
});

/**
 * Holds the boot screen until the scene tree is mounted and the first
 * asset wave has settled — never reveal an empty corridor.
 */
function SceneLoadGate({ children }: { children: ReactNode }): JSX.Element {
  const { active, progress } = useProgress();
  const isSceneMounted = useSceneReadyStore((s) => s.isSceneMounted);
  const [assetsSettled, setAssetsSettled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (assetsSettled) return;

    if (!active && progress >= 100) {
      const settle = window.setTimeout(() => setAssetsSettled(true), 280);
      return () => window.clearTimeout(settle);
    }

    // Cached / empty loaders can stay at 0 — don't hang forever.
    const safety = window.setTimeout(() => setAssetsSettled(true), 12000);
    return () => window.clearTimeout(safety);
  }, [active, progress, assetsSettled]);

  useEffect(() => {
    if (ready) return;
    if (isSceneMounted && assetsSettled) {
      setReady(true);
    }
  }, [isSceneMounted, assetsSettled, ready]);

  return (
    <>
      {children}
      {!ready ? <AppLoadingScreen /> : null}
    </>
  );
}

/**
 * Experience shell — canvas is code-split; overlays mount with it.
 */
export function AppExperience(): JSX.Element {
  usePrefersReducedMotion();
  useKeyboardNavigation();
  useWheelNavigation();
  useMobileSwipeNavigation();
  useMobileExperienceBootstrap();
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
  const techIconsLoading = useTechHiveLoadingStore((s) => s.isLoading);
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
    <SceneLoadGate>
      <Suspense fallback={<AppLoadingScreen bootOnly />}>
        <ExperienceCanvas />
      </Suspense>
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
      {DEV_TOOLS_CONFIG.contactFaceLinksTuningPanel ? (
        <ContactFaceLinksTuningPanel />
      ) : null}
      <NavigationGuideOverlay />
      {techIconsLoading ? <TechHiveLoadingOverlay /> : null}
    </SceneLoadGate>
  );
}
