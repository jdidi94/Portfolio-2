import { useFrame, useThree } from "@react-three/fiber";
import { CAMERA_CONFIG } from "@config/camera";
import { cameraMotion } from "@scene/camera/cameraMotion";
import { useExperienceStore } from "@store/experienceStore";
import type { PerspectiveCamera } from "three";
import { Vector3 } from "three";

const parallaxOffset = new Vector3();
const REFERENCE_FPS = 60;

/**
 * Applies subtle mouse parallax and idle breathing on top of the GSAP base pose.
 * Smoothing is delta-scaled so feel stays consistent across refresh rates.
 */
export function CameraRig(): null {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const pointer = useThree((state) => state.pointer);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const mode = useExperienceStore((s) => s.mode);

  useFrame((state, delta) => {
    if (prefersReducedMotion) {
      camera.position.copy(cameraMotion.basePosition);
      camera.lookAt(cameraMotion.lookAt);
      return;
    }

    const parallaxScale =
      mode === "transition" ? 0.25 : CAMERA_CONFIG.parallaxStrength;
    const targetX = pointer.x * parallaxScale;
    const targetY = pointer.y * parallaxScale * 0.6;
    const breath =
      Math.sin(state.clock.elapsedTime * CAMERA_CONFIG.breathSpeed) *
      CAMERA_CONFIG.breathAmplitude;

    const alpha = 1 - Math.pow(1 - CAMERA_CONFIG.parallaxSmoothing, delta * REFERENCE_FPS);

    parallaxOffset.x += (targetX - parallaxOffset.x) * alpha;
    parallaxOffset.y += (targetY + breath - parallaxOffset.y) * alpha;
    parallaxOffset.z = 0;

    camera.position.copy(cameraMotion.basePosition).add(parallaxOffset);
    camera.lookAt(cameraMotion.lookAt);
  });

  return null;
}
