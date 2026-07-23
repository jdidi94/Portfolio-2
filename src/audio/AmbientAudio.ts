import { audioManager } from "@audio/AudioManager";

/** Ambient loop control — playback stays in AudioManager. */
export const AmbientAudio = {
  start(): void {
    audioManager.enable();
  },

  stop(): void {
    audioManager.disable();
  },
} as const;
