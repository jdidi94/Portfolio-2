export const POSTPROCESSING_CONFIG = {
  bloom: {
    intensity: 0.5,
    luminanceThreshold: 0.38,
    luminanceSmoothing: 0.4,
  },
  vignette: {
    offset: 0.28,
    darkness: 0.5,
  },
  noise: {
    opacity: 0.03,
  },
  depthOfField: {
    focalLength: 0.035,
    bokehScale: 1.1,
    focusRange: 0.04,
  },
} as const;
