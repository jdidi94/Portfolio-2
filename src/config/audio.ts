export const AUDIO_CONFIG = {
  masterVolume: 0.35,
  ambientVolume: 0.18,
  sfxVolume: 0.4,
  /** Optional public URLs — AudioManager no-ops gracefully when missing. */
  sources: {
    ambient: "/audio/ambient.mp3",
    hover: "/audio/hover.mp3",
    focus: "/audio/focus.mp3",
    transition: "/audio/transition.mp3",
  },
} as const;
