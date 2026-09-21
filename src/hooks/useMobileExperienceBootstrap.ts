import { useEffect, useRef } from "react";
import { SECTION_NAV_STOPS } from "@config/sections";
import { useExperienceStore } from "@store/experienceStore";
import { useMobileNavStore } from "@store/mobileNavStore";
import { useViewportStore } from "@store/viewportStore";

/**
 * On small viewports, land on the first section (Hero) with full-shape framing
 * instead of an empty explore corridor.
 */
export function useMobileExperienceBootstrap(): void {
  const tier = useViewportStore((s) => s.tier);
  const enteredRef = useRef(false);

  useEffect(() => {
    if (tier !== "small") {
      enteredRef.current = false;
      return;
    }

    if (enteredRef.current) return;

    const focusObjectId = useExperienceStore.getState().focusObjectId;
    if (focusObjectId !== null) {
      enteredRef.current = true;
      return;
    }

    const heroStop = SECTION_NAV_STOPS[0];
    if (!heroStop) return;

    enteredRef.current = true;
    useMobileNavStore.getState().enterSection(heroStop);
  }, [tier]);
}
