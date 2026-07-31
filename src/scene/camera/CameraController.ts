import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { CAMERA_CONFIG } from "@config/camera";
import { WAYPOINTS, EXPLORE_WAYPOINT_ID } from "@config/waypoints";
import { ExperienceManager } from "@experience/ExperienceManager";
import { cameraMotion } from "@scene/camera/cameraMotion";
import { useExperienceStore } from "@store/experienceStore";
import { useMobileNavStore } from "@store/mobileNavStore";
import { useViewportStore } from "@store/viewportStore";
import type { PerspectiveCamera } from "three";
import { Vector3 } from "three";

function scaledCameraPosition(
  cameraPosition: readonly [number, number, number],
  lookAt: readonly [number, number, number],
  distanceScale: number,
  exploreZ: number,
  waypointId: string,
  corridorScaleX: number,
): Vector3 {
  const scaledLook: [number, number, number] = [
    lookAt[0] * corridorScaleX,
    lookAt[1],
    lookAt[2],
  ];
  const scaledCam: [number, number, number] = [
    cameraPosition[0] * corridorScaleX,
    cameraPosition[1],
    cameraPosition[2],
  ];

  if (waypointId === EXPLORE_WAYPOINT_ID) {
    return new Vector3(scaledCam[0], scaledCam[1], exploreZ);
  }

  const look = new Vector3(...scaledLook);
  const cam = new Vector3(...scaledCam);
  const offset = cam.clone().sub(look).multiplyScalar(distanceScale);
  return look.clone().add(offset);
}

/**
 * GSAP-driven camera travel between waypoints.
 * Small: prefers mobileNav cameraTarget so one card fills ~95% of the frame.
 */
export function useCameraController(): void {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const destinationId = useExperienceStore((s) => s.cameraDestinationId);
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const cameraDistanceScale = useViewportStore((s) => s.cameraDistanceScale);
  const exploreZ = useViewportStore((s) => s.exploreZ);
  const fov = useViewportStore((s) => s.fov);
  const corridorScaleX = useViewportStore((s) => s.corridorScaleX);
  const tier = useViewportStore((s) => s.tier);
  const mobileTarget = useMobileNavStore((s) => s.cameraTarget);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, fov]);

  useEffect(() => {
    const useMobile =
      tier === "small" &&
      mobileTarget !== null &&
      mobileTarget.objectId === destinationId;

    const waypoint = WAYPOINTS.find((item) => item.id === destinationId);
    if (!useMobile && !waypoint) {
      return;
    }

    tweenRef.current?.kill();

    const duration = prefersReducedMotion
      ? 0.01
      : CAMERA_CONFIG.transitionDuration;

    const fromPosition = cameraMotion.basePosition.clone();
    const fromLook = cameraMotion.lookAt.clone();

    let toPosition: Vector3;
    let toLook: Vector3;

    if (useMobile && mobileTarget) {
      // Absolute close framing — card fills ~95% width; camera X locked on card.
      toLook = new Vector3(
        mobileTarget.lookAt[0] * corridorScaleX,
        mobileTarget.lookAt[1],
        mobileTarget.lookAt[2],
      );
      toPosition = new Vector3(
        toLook.x,
        mobileTarget.cameraPosition[1],
        toLook.z +
          (mobileTarget.cameraPosition[2] - mobileTarget.lookAt[2]),
      );
    } else if (waypoint) {
      toPosition = scaledCameraPosition(
        waypoint.cameraPosition,
        waypoint.lookAt,
        cameraDistanceScale,
        exploreZ,
        waypoint.id,
        corridorScaleX,
      );
      toLook = new Vector3(
        waypoint.lookAt[0] * corridorScaleX,
        waypoint.lookAt[1],
        waypoint.lookAt[2],
      );
    } else {
      return;
    }

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
  }, [
    camera,
    destinationId,
    prefersReducedMotion,
    cameraDistanceScale,
    exploreZ,
    corridorScaleX,
    tier,
    mobileTarget,
  ]);
}
