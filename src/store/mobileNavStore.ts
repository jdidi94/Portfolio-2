import { create } from "zustand";
import type { Vector3Tuple } from "three";
import {
  mobileRailForStopId,
  resolveMobileCardFraming,
  resolveMobileItemObjectId,
  resolveMobileRails,
  MOBILE_NAV_CONFIG,
  type MobileSectionRailConfig,
} from "@config/mobileNav";
import {
  CONTENT_CARD_PLACEMENTS,
  SECTION_NAV_STOPS,
  sectionStopForObjectId,
} from "@config/sections";
import { ABOUT_CHARACTER_CONFIG } from "@config/aboutCharacter";
import { EXPERIENCE_SECTION_CONFIG } from "@config/experienceSection";
import { PROJECT_CAROUSEL_CONFIG } from "@config/projectCarousel";
import { ELEVATOR_CONFIG } from "@config/elevator";
import {
  TECH_HIVE_LAYOUT_DEFAULTS,
  resolveTechHiveLayout,
} from "@config/techHiveLayout";
import { ExperienceManager } from "@experience/ExperienceManager";
import { useTechHiveStore } from "@store/techHiveStore";
import { useProjectCarouselStore } from "@store/projectCarouselStore";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperiencePanelStore } from "@store/experiencePanelStore";
import { useExperienceStore } from "@store/experienceStore";
import { useViewportStore } from "@store/viewportStore";

export interface MobileCameraTarget {
  objectId: string;
  lookAt: Vector3Tuple;
  cameraPosition: Vector3Tuple;
}

interface MobileNavState {
  itemIndex: number;
  cameraTarget: MobileCameraTarget | null;
  goNextSection: () => void;
  goPrevSection: () => void;
  stepItem: (delta: number) => void;
  setItemIndex: (index: number) => void;
  /** Jump to a section stop at item 0 (used to enter Hero on mobile boot). */
  enterSection: (stopId: string) => void;
}

function closeAllPanels(): void {
  useTechHiveStore.getState().closePanel();
  useProjectCarouselStore.getState().closeCaseStudy();
  useElevatorStore.getState().closePanel();
  useExperiencePanelStore.getState().closePanel();
}

function canNavigate(): boolean {
  if (useViewportStore.getState().tier !== "small") return false;
  return useExperienceStore.getState().mode !== "transition";
}

function currentStopId(): string | null {
  const focusId = useExperienceStore.getState().focusObjectId;
  if (focusId === null) return null;
  return sectionStopForObjectId(focusId) ?? focusId;
}

function sectionLookAt(stopId: string): Vector3Tuple {
  const rail = mobileRailForStopId(stopId);
  switch (rail?.sectionId) {
    case "about":
      return [
        ABOUT_CHARACTER_CONFIG.origin[0],
        ABOUT_CHARACTER_CONFIG.origin[1] + ABOUT_CHARACTER_CONFIG.small.lookAtY,
        ABOUT_CHARACTER_CONFIG.origin[2],
      ];
    case "projects":
      return [...PROJECT_CAROUSEL_CONFIG.origin];
    case "experience":
      return [...EXPERIENCE_SECTION_CONFIG.origin];
    case "skills": {
      const layout = resolveTechHiveLayout(TECH_HIVE_LAYOUT_DEFAULTS, 1);
      return [...layout.origin];
    }
    case "timeline":
      return [
        ELEVATOR_CONFIG.origin[0],
        ELEVATOR_CONFIG.origin[1] +
          MOBILE_NAV_CONFIG.timelineClusterOffsetY,
        ELEVATOR_CONFIG.origin[2],
      ];
    case "contact": {
      const contact = CONTENT_CARD_PLACEMENTS.find((c) => c.objectId === "contact");
      return contact ? [...contact.position] : [0, 0.55, -92];
    }
    case "hero": {
      const hero = CONTENT_CARD_PLACEMENTS.find((c) => c.objectId === "hero");
      return hero ? [...hero.position] : [0, 0.55, -5];
    }
    default:
      return [0, 0.55, -5];
  }
}

function buildCameraTarget(
  stopId: string,
  itemIndex: number,
): MobileCameraTarget {
  const rail = mobileRailForStopId(stopId);
  const objectId = resolveMobileItemObjectId(stopId, itemIndex);
  const distance =
    rail?.sectionId === "skills"
      ? MOBILE_NAV_CONFIG.techFocusDistance
      : rail?.sectionId === "timeline"
        ? MOBILE_NAV_CONFIG.timelineFocusDistance
        : rail?.sectionId === "hero"
          ? MOBILE_NAV_CONFIG.heroFocusDistance
          : rail?.sectionId === "contact" ||
              (rail?.sectionId === "about" && itemIndex === 0)
            ? MOBILE_NAV_CONFIG.sectionCardFocusDistance
            : MOBILE_NAV_CONFIG.focusDistance;
  const eyeHeight =
    rail?.sectionId === "skills"
      ? MOBILE_NAV_CONFIG.techFocusEyeHeight
      : rail?.sectionId === "timeline"
        ? MOBILE_NAV_CONFIG.timelineFocusEyeHeight
        : MOBILE_NAV_CONFIG.focusEyeHeight;
  const framing = resolveMobileCardFraming(
    sectionLookAt(stopId),
    distance,
    eyeHeight,
  );
  return {
    objectId,
    lookAt: framing.lookAt,
    cameraPosition: framing.cameraPosition,
  };
}

/**
 * Small-viewport scroll director — one full-bleed 3D card at a time.
 * Edge past last/first loops into the next/previous section.
 */
export const useMobileNavStore = create<MobileNavState>((set, get) => {
  const focusRailItem = (stopId: string, itemIndex: number): void => {
    const previousStop = currentStopId();
    closeAllPanels();
    const target = buildCameraTarget(stopId, itemIndex);
    const instant =
      previousStop !== null &&
      previousStop === stopId &&
      useExperienceStore.getState().mode !== "explore";
    set({ itemIndex, cameraTarget: target });
    ExperienceManager.focusMobileTarget(target, { instant });
  };

  return {
    itemIndex: 0,
    cameraTarget: null,

    setItemIndex: (index) => {
      const stopId = currentStopId();
      if (!stopId) {
        set({ itemIndex: 0 });
        return;
      }
      const rail = mobileRailForStopId(stopId);
      if (!rail) return;
      const clamped = Math.max(0, Math.min(rail.itemCount - 1, index));
      focusRailItem(stopId, clamped);
    },

    enterSection: (stopId) => {
      if (!SECTION_NAV_STOPS.includes(stopId)) return;
      focusRailItem(stopId, 0);
    },

    goNextSection: () => {
      if (!canNavigate()) return;
      const rails = resolveMobileRails();
      const stopId = currentStopId();
      let nextIndex = 0;
      if (stopId !== null) {
        const index = SECTION_NAV_STOPS.indexOf(stopId);
        nextIndex = index < 0 ? 0 : (index + 1) % rails.length;
      }
      focusRailItem(SECTION_NAV_STOPS[nextIndex], 0);
    },

    goPrevSection: () => {
      if (!canNavigate()) return;
      const rails = resolveMobileRails();
      const stopId = currentStopId();
      if (stopId === null) {
        focusRailItem(SECTION_NAV_STOPS[rails.length - 1], 0);
        return;
      }
      const index = SECTION_NAV_STOPS.indexOf(stopId);
      const prevIndex = index <= 0 ? rails.length - 1 : index - 1;
      const prevStop = SECTION_NAV_STOPS[prevIndex];
      const prevRail = mobileRailForStopId(prevStop);
      const lastItem = Math.max(0, (prevRail?.itemCount ?? 1) - 1);
      focusRailItem(prevStop, lastItem);
    },

    stepItem: (delta) => {
      if (!canNavigate()) return;

      const stopId = currentStopId();
      if (stopId === null) {
        if (delta > 0) focusRailItem(SECTION_NAV_STOPS[0], 0);
        else get().goPrevSection();
        return;
      }

      const rail = mobileRailForStopId(stopId);
      if (!rail || rail.axis === "none" || rail.itemCount <= 1) {
        if (delta > 0) get().goNextSection();
        else get().goPrevSection();
        return;
      }

      const next = get().itemIndex + delta;
      if (next < 0) {
        get().goPrevSection();
        return;
      }
      if (next >= rail.itemCount) {
        get().goNextSection();
        return;
      }
      focusRailItem(stopId, next);
    },
  };
});

export function useMobileActiveRail(): MobileSectionRailConfig | null {
  const focusObjectId = useExperienceStore((s) => s.focusObjectId);
  if (focusObjectId === null) return null;
  const stopId = sectionStopForObjectId(focusObjectId) ?? focusObjectId;
  return mobileRailForStopId(stopId) ?? null;
}
