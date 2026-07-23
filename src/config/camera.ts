export const CAMERA_CONFIG = {
  fov: 45,
  near: 0.1,
  far: 200,
  position: [0, 1.2, 8] as [number, number, number],
  lookAt: [0, 0, 0] as [number, number, number],
  transitionDuration: 1.8,
  transitionEase: "power2.inOut",
  parallaxStrength: 0.35,
  parallaxSmoothing: 0.08,
  breathAmplitude: 0.04,
  breathSpeed: 0.45,
} as const;
