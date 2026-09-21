import type { JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import { RENDERER_CONFIG } from "@config/renderer";
import { COLORS } from "@config/colors";
import { SceneRoot } from "@scene/SceneRoot";
import { AdaptiveQuality } from "@renderer/AdaptiveQuality";
import { NavigationManager } from "@experience/NavigationManager";
import { useViewportStore } from "@store/viewportStore";

/** Clicking empty scene space returns directly to the overview. */
function handlePointerMissed(): void {
  NavigationManager.goHome();
}

export function ExperienceCanvas(): JSX.Element {
  const dprMax = useViewportStore((s) => s.dprMax);
  const tier = useViewportStore((s) => s.tier);
  // Antialias is a GL context flag — bind only to tier so quality
  // changes do not remount the Canvas.
  const antialias = RENDERER_CONFIG.antialias && tier !== "small";

  return (
    <Canvas
      dpr={[RENDERER_CONFIG.dprMin, dprMax]}
      performance={{ min: 0.5, max: 1, debounce: 200 }}
      gl={{
        antialias,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: RENDERER_CONFIG.toneMappingExposure,
      }}
      style={{ background: COLORS.black }}
      onPointerMissed={handlePointerMissed}
    >
      <AdaptiveQuality />
      <SceneRoot />
    </Canvas>
  );
}
