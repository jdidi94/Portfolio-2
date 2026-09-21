export const POSTPROCESSING_CONFIG = {
  bloom: {
    /**
     * Slightly stronger explore bloom so neon punches through corridor haze
     * without washing focused card text (focus uses bloomFocus).
     */
    intensity: 0.34,
    luminanceThreshold: 0.7,
    luminanceSmoothing: 0.5,
  },
  /** Softer bloom while a card is focused for readable detail copy. */
  bloomFocus: {
    intensity: 0.12,
    luminanceThreshold: 0.88,
    luminanceSmoothing: 0.65,
  },
  vignette: {
    offset: 0.3,
    darkness: 0.52,
  },
  noise: {
    opacity: 0.014,
  },
  depthOfField: {
    /**
     * Explore / travel atmosphere — distant bands soften into shapes.
     * Disabled while reading a focused card.
     */
    enabledInExplore: true,
    enabledInFocus: false,
    /** Also soften during camera travel between sections. */
    enabledInTransition: true,
    focalLength: 0.024,
    bokehScale: 1.15,
    focusRange: 0.045,
    /** Milder DoF while the camera is tweening. */
    transitionBokehScale: 0.7,
    transitionFocusRange: 0.07,
  },
} as const;
