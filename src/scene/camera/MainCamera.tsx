import type { JSX } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { CAMERA_CONFIG } from "@config/camera";
import { useCameraController } from "@scene/camera/CameraController";
import { CameraRig } from "@scene/camera/CameraRig";

function CameraControllerHost(): null {
  useCameraController();
  return null;
}

export function MainCamera(): JSX.Element {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        fov={CAMERA_CONFIG.fov}
        near={CAMERA_CONFIG.near}
        far={CAMERA_CONFIG.far}
        position={CAMERA_CONFIG.position}
      />
      <CameraControllerHost />
      <CameraRig />
    </>
  );
}
