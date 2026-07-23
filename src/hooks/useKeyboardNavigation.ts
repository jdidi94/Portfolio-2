import { useEffect } from "react";
import { NavigationManager } from "@experience/NavigationManager";
import { ExperienceManager } from "@experience/ExperienceManager";
import { audioManager } from "@audio/AudioManager";

/** Development / a11y keyboard navigation for camera travel. */
export function useKeyboardNavigation(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      switch (event.key) {
        case "ArrowRight":
        case "n":
        case "N":
          event.preventDefault();
          NavigationManager.focusNext();
          break;
        case "ArrowLeft":
        case "p":
        case "P":
          event.preventDefault();
          NavigationManager.focusPrevious();
          break;
        case "Escape":
          event.preventDefault();
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
