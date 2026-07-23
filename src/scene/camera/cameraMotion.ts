import { Vector3 } from "three";
import { CAMERA_CONFIG } from "@config/camera";

/** Shared camera base pose — GSAP owns base; rig adds parallax/breath only. */
export const cameraMotion = {
  basePosition: new Vector3(...CAMERA_CONFIG.position),
  lookAt: new Vector3(...CAMERA_CONFIG.lookAt),
};
