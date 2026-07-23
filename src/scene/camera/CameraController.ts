import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { CAMERA_CONFIG } from "@config/camera";
import { WAYPOINTS } from "@config/waypoints";
import { ExperienceManager } from "@experience/ExperienceManager";
import { cameraMotion } from "@scene/camera/cameraMotion";
import { useExperienceStore } from "@store/experienceStore";
import type { PerspectiveCamera } from "three";
import { Vector3 } from "three";

/**
 * GSAP-driven camera travel between waypoints.
 * Parallax and breathing are applied in CameraRig.
 */
export function useCameraController(): void {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const destinationId = useExperienceStore((s) => s.cameraDestinationId);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const waypoint = WAYPOINTS.find((item) => item.id === destinationId);
    if (!waypoint) {
      return;
    }

    tweenRef.current?.kill();

    const duration = prefersReducedMotion
      ? 0.01
      : CAMERA_CONFIG.transitionDuration;

    const fromPosition = cameraMotion.basePosition.clone();
    const toPosition = new Vector3(...waypoint.cameraPosition);
    const fromLook = cameraMotion.lookAt.clone();
    const toLook = new Vector3(...waypoint.lookAt);

    const proxy = { t: 0 };

    tweenRef.current = gsap.to(proxy, {
      t: 1,
      duration,
      ease: CAMERA_CONFIG.transitionEase,
      onUpdate: () => {
        cameraMotion.basePosition.lerpVectors(
          fromPosition,
          toPosition,
          proxy.t,
        );
        cameraMotion.lookAt.lerpVectors(fromLook, toLook, proxy.t);
        camera.position.copy(cameraMotion.basePosition);
        camera.lookAt(cameraMotion.lookAt);
      },
      onComplete: () => {
        cameraMotion.basePosition.copy(toPosition);
        cameraMotion.lookAt.copy(toLook);
        camera.position.copy(cameraMotion.basePosition);
        camera.lookAt(cameraMotion.lookAt);
        ExperienceManager.onCameraArrived();
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [camera, destinationId, prefersReducedMotion]);
}
