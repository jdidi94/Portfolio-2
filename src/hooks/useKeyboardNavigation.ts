import { useEffect } from "react";
import { NavigationManager } from "@experience/NavigationManager";
import { ExperienceManager } from "@experience/ExperienceManager";
import { audioManager } from "@audio/AudioManager";
import { useTechHiveStore } from "@store/techHiveStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperiencePanelStore } from "@store/experiencePanelStore";
import { useExperienceStore } from "@store/experienceStore";
import { useMobileNavStore } from "@store/mobileNavStore";
import { useMobileMenuStore } from "@store/mobileMenuStore";
import { useViewportStore } from "@store/viewportStore";
import { projects } from "@data/projects";
import { nudgeIfPanelOpen } from "@utils/panelGate";
import {
  ELEVATOR_WAYPOINT_ID,
  ELEVATOR_DETAIL_WAYPOINT_ID,
} from "@utils/elevatorIds";

/** Development / a11y keyboard navigation for camera travel + carousel. */
export function useKeyboardNavigation(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const projectStore = useProjectCarouselStore.getState();
      const elevatorStore = useElevatorStore.getState();
      const experiencePanelStore = useExperiencePanelStore.getState();
      const mobileNav = useMobileNavStore.getState();
      const mobileMenu = useMobileMenuStore.getState();
      const activeSection = useExperienceStore.getState().activeSection;
      const isSmall = useViewportStore.getState().tier === "small";
      const caseStudyOpen = projectStore.selectedProjectId !== null;
      const milestoneOpen = elevatorStore.selectedEventId !== null;
      const experienceOpen = experiencePanelStore.selectedExperienceId !== null;
      const techOpen = useTechHiveStore.getState().selectedTechId !== null;
      const onProjects = activeSection === "projects";
      const onTimeline = activeSection === "timeline";
      const panelOpen =
        caseStudyOpen || milestoneOpen || experienceOpen || techOpen;

      // Small: Escape closes panels; arrows / n / p step the scroll rail only.
      if (isSmall) {
        switch (event.key) {
          case "Escape":
            event.preventDefault();
            if (mobileMenu.isOpen) {
              mobileMenu.close();
              break;
            }
            if (projectStore.selectedProjectId) {
              projectStore.closeCaseStudy();
              break;
            }
            if (experiencePanelStore.selectedExperienceId) {
              experiencePanelStore.closePanel();
              break;
            }
            if (useTechHiveStore.getState().selectedTechId) {
              useTechHiveStore.getState().closePanel();
              break;
            }
            if (elevatorStore.selectedEventId) {
              elevatorStore.closePanel();
              break;
            }
            break;
          case "ArrowRight":
          case "ArrowDown":
          case "n":
          case "N":
            if (panelOpen) {
              event.preventDefault();
              nudgeIfPanelOpen();
              break;
            }
            if (!mobileMenu.isOpen) {
              event.preventDefault();
              mobileNav.stepItem(1);
            }
            break;
          case "ArrowLeft":
          case "ArrowUp":
          case "p":
          case "P":
            if (panelOpen) {
              event.preventDefault();
              nudgeIfPanelOpen();
              break;
            }
            if (!mobileMenu.isOpen) {
              event.preventDefault();
              mobileNav.stepItem(-1);
            }
            break;
          case "m":
          case "M":
            event.preventDefault();
            audioManager.toggle();
            break;
          default:
            break;
        }
        return;
      }

      switch (event.key) {
        case "ArrowRight":
          if (onProjects && !caseStudyOpen) {
            event.preventDefault();
            projectStore.step(1);
            break;
          }
          if (onTimeline && !milestoneOpen) {
            event.preventDefault();
            elevatorStore.step(1);
            break;
          }
          event.preventDefault();
          NavigationManager.focusNext();
          break;
        case "ArrowLeft":
          if (onProjects && !caseStudyOpen) {
            event.preventDefault();
            projectStore.step(-1);
            break;
          }
          if (onTimeline && !milestoneOpen) {
            event.preventDefault();
            elevatorStore.step(-1);
            break;
          }
          event.preventDefault();
          NavigationManager.focusPrevious();
          break;
        case "ArrowUp":
          if (onTimeline && !milestoneOpen) {
            event.preventDefault();
            elevatorStore.step(1);
            break;
          }
          break;
        case "ArrowDown":
          if (onTimeline && !milestoneOpen) {
            event.preventDefault();
            elevatorStore.step(-1);
            break;
          }
          break;
        case "n":
        case "N":
          event.preventDefault();
          NavigationManager.focusNext();
          break;
        case "p":
        case "P":
          event.preventDefault();
          NavigationManager.focusPrevious();
          break;
        case "Enter":
          if (onProjects && !caseStudyOpen && projects.length > 0) {
            event.preventDefault();
            const project = projects[projectStore.frontIndex];
            if (project) {
              projectStore.openProject(project.id);
            }
            break;
          }
          if (onTimeline && !milestoneOpen) {
            event.preventDefault();
            elevatorStore.openCurrent();
            ExperienceManager.focusObject(ELEVATOR_DETAIL_WAYPOINT_ID);
            break;
          }
          break;
        case "Escape":
          event.preventDefault();
          if (projectStore.selectedProjectId) {
            projectStore.closeCaseStudy();
            break;
          }
          if (experiencePanelStore.selectedExperienceId) {
            experiencePanelStore.closePanel();
            break;
          }
          if (useTechHiveStore.getState().selectedTechId) {
            useTechHiveStore.getState().closePanel();
            break;
          }
          if (elevatorStore.selectedEventId) {
            elevatorStore.closePanel();
            ExperienceManager.focusObject(ELEVATOR_WAYPOINT_ID);
            break;
          }
          NavigationManager.escape();
          break;
        case "Home":
          event.preventDefault();
          ExperienceManager.returnToExplore();
          break;
        case "m":
        case "M":
          event.preventDefault();
          audioManager.toggle();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
}
