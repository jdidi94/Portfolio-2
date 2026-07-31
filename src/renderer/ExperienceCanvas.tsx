import type { JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import { RENDERER_CONFIG } from "@config/renderer";
import { COLORS } from "@config/colors";
import { SceneRoot } from "@scene/SceneRoot";
import { NavigationManager } from "@experience/NavigationManager";
import { useViewportStore } from "@store/viewportStore";

/** Clicking empty scene space returns directly to the overview. */
function handlePointerMissed(): void {
  NavigationManager.goHome();
}

export function ExperienceCanvas(): JSX.Element {
  const dprMax = useViewportStore((s) => s.dprMax);

  return (
    <Canvas
      dpr={[RENDERER_CONFIG.dprMin, dprMax]}
      gl={{
        antialias: RENDERER_CONFIG.antialias,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: RENDERER_CONFIG.toneMappingExposure,
      }}
      style={{ background: COLORS.black }}
      onPointerMissed={handlePointerMissed}
    >
      <SceneRoot />
    </Canvas>
  );
}
