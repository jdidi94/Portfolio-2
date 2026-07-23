import type { JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import { RENDERER_CONFIG } from "@config/renderer";
import { COLORS } from "@config/colors";
import { SceneRoot } from "@scene/SceneRoot";
import { ExperienceManager } from "@experience/ExperienceManager";
import { useExperienceStore } from "@store/experienceStore";
import { EXPLORE_WAYPOINT_ID } from "@config/waypoints";

function handlePointerMissed(): void {
  const { cameraDestinationId, focusObjectId } = useExperienceStore.getState();
  if (
    cameraDestinationId === EXPLORE_WAYPOINT_ID &&
    focusObjectId === null
  ) {
    return;
  }
  ExperienceManager.returnToExplore();
}

export function ExperienceCanvas(): JSX.Element {
  return (
    <Canvas
      dpr={[RENDERER_CONFIG.dprMin, RENDERER_CONFIG.dprMax]}
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
