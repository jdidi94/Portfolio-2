import type { JSX } from "react";
import { ExperienceCanvas } from "@renderer/ExperienceCanvas";
import { ExperienceHud } from "@components/ui/ExperienceHud";
import { useKeyboardNavigation } from "@hooks/useKeyboardNavigation";
import { usePrefersReducedMotion } from "@hooks/usePrefersReducedMotion";
import { CursorManager } from "@interaction/CursorManager";
import { useEffect } from "react";
import { useExperienceStore } from "@store/experienceStore";

export function App(): JSX.Element {
  usePrefersReducedMotion();
  useKeyboardNavigation();

  const hoveredObjectId = useExperienceStore((s) => s.hoveredObjectId);

  useEffect(() => {
    CursorManager.syncFromHover();
  }, [hoveredObjectId]);

  useEffect(() => {
    return () => {
      CursorManager.reset();
    };
  }, []);

  return (
    <main className="relative h-dvh w-dvw overflow-hidden bg-[#050508]">
      <ExperienceCanvas />
      <ExperienceHud />
    </main>
  );
}
