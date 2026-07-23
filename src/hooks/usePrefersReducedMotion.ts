import { useEffect } from "react";
import { useExperienceStore } from "@store/experienceStore";

export function usePrefersReducedMotion(): void {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = (): void => {
      useExperienceStore.getState().setPrefersReducedMotion(media.matches);
    };

    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
    };
  }, []);
}
