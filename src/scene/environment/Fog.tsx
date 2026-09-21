import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Fog, MathUtils } from "three";
import { FOG_CONFIG } from "@config/fog";
import { cameraMotion } from "@scene/camera/cameraMotion";
import { useExperienceStore } from "@store/experienceStore";

/**
 * Linear depth fog anchored to the camera look-at.
 * Active section stays clear; deeper corridor fades to neon silhouettes.
 * Navigation is unaffected — visual only.
 */
export function SceneFog(): null {
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const mode = useExperienceStore((s) => s.mode);
  const fogRef = useRef<Fog | null>(null);

  useEffect(() => {
    const previous = scene.fog;
    const fog = new Fog(FOG_CONFIG.color, 10, 28);
    fogRef.current = fog;
    scene.fog = fog;

    return () => {
      scene.fog = previous;
      fogRef.current = null;
    };
  }, [scene]);

  useFrame((_, delta) => {
    const fog = fogRef.current;
    if (!fog) return;

    const focusDistance = camera.position.distanceTo(cameraMotion.lookAt);
    const clearBoost = mode === "focus" ? FOG_CONFIG.focusClearBoost : 0;
    const targetNear = Math.max(
      FOG_CONFIG.nearMin,
      focusDistance + FOG_CONFIG.clearPadding + clearBoost,
    );
    const targetFar = Math.min(
      FOG_CONFIG.farMax,
      targetNear + FOG_CONFIG.hazeDepth,
    );

    fog.near = MathUtils.damp(
      fog.near,
      targetNear,
      FOG_CONFIG.dampLambda,
      delta,
    );
    fog.far = MathUtils.damp(
      fog.far,
      targetFar,
      FOG_CONFIG.dampLambda,
      delta,
    );
  });

  return null;
}
