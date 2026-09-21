import type { NavigationMode } from "@experience/ExperienceState";

export interface CameraPanRange {
  /** Max left/right camera travel (world units) at pointer extremes. */
  x: number;
  /** Max up/down camera travel (world units) at pointer extremes. */
  y: number;
}

export const CAMERA_CONFIG = {
  fov: 42,
  near: 0.1,
  far: 280,
  position: [0, 1.2, 5.33] as [number, number, number],
  lookAt: [0, 0, 0] as [number, number, number],
  transitionDuration: 2.9,
  transitionEase: "power3.inOut",
  /**
   * Pointer-driven camera freedom per navigation mode.
   * Wide explore ranges let the user peek around cards that overlap in
   * depth (same x/y, different z) so occluded cards stay clickable.
   * LookAt stays fixed, so the pan orbits the framed target.
   */
  panRange: {
    explore: { x: 2.6, y: 1.3 },
    focus: { x: 1.4, y: 0.8 },
    transition: { x: 0.25, y: 0.12 },
  } satisfies Record<NavigationMode, CameraPanRange>,
  parallaxSmoothing: 0.06,
  breathAmplitude: 0.03,
  breathSpeed: 0.35,
} as const;
