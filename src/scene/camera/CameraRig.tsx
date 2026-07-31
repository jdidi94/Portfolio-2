import { useFrame, useThree } from "@react-three/fiber";
import { CAMERA_CONFIG } from "@config/camera";
import { cameraMotion } from "@scene/camera/cameraMotion";
import { useExperienceStore } from "@store/experienceStore";
import { useViewportStore } from "@store/viewportStore";
import type { PerspectiveCamera } from "three";
import { Vector3 } from "three";

const parallaxOffset = new Vector3();
const REFERENCE_FPS = 60;

/**
 * Applies pointer-driven pan (up/down/left/right) and idle breathing on top
 * of the GSAP base pose. Pan range widens in explore mode so overlapping
 * cards can be seen around and clicked; mid/small tiers scale pan down so
 * touch and narrow frames stay controlled.
 */
export function CameraRig(): null {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const pointer = useThree((state) => state.pointer);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const mode = useExperienceStore((s) => s.mode);
  const panScale = useViewportStore((s) => s.panScale);

  useFrame((state, delta) => {
    if (prefersReducedMotion) {
      camera.position.copy(cameraMotion.basePosition);
      camera.lookAt(cameraMotion.lookAt);
      return;
    }

    const panRange = CAMERA_CONFIG.panRange[mode];
    const targetX = pointer.x * panRange.x * panScale;
    const targetY = pointer.y * panRange.y * panScale;
    const breath =
      Math.sin(state.clock.elapsedTime * CAMERA_CONFIG.breathSpeed) *
      CAMERA_CONFIG.breathAmplitude;

    const alpha =
      1 -
      Math.pow(1 - CAMERA_CONFIG.parallaxSmoothing, delta * REFERENCE_FPS);

    parallaxOffset.x += (targetX - parallaxOffset.x) * alpha;
    parallaxOffset.y += (targetY + breath - parallaxOffset.y) * alpha;
    parallaxOffset.z = 0;

    camera.position.copy(cameraMotion.basePosition).add(parallaxOffset);
    camera.lookAt(cameraMotion.lookAt);
  });

  return null;
}
