import { useEffect } from "react";
import { useViewportStore } from "@store/viewportStore";

/**
 * Keeps viewport tier + orientation knobs in sync with window size.
 */
export function useViewportSync(): void {
  const syncFromWindow = useViewportStore((s) => s.syncFromWindow);

  useEffect(() => {
    syncFromWindow();

    let frame = 0;
    const onResize = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        syncFromWindow();
      });
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [syncFromWindow]);
}
