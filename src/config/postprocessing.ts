export const POSTPROCESSING_CONFIG = {
  bloom: {
    /** Kept low so white card text does not bloom into a halo. */
    intensity: 0.22,
    /** Above typical face text luminance so copy stays sharp. */
    luminanceThreshold: 0.78,
    luminanceSmoothing: 0.55,
  },
  /** Softer bloom while a card is focused for readable detail copy. */
  bloomFocus: {
    intensity: 0.12,
    luminanceThreshold: 0.88,
    luminanceSmoothing: 0.65,
  },
  vignette: {
    offset: 0.28,
    darkness: 0.45,
  },
  noise: {
    opacity: 0.012,
  },
  depthOfField: {
    /** Mild explore atmosphere only — disabled while reading focused cards. */
    enabledInExplore: true,
    enabledInFocus: false,
    focalLength: 0.018,
    bokehScale: 0.35,
    focusRange: 0.1,
  },
} as const;
