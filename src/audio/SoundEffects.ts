import { audioManager } from "@audio/AudioManager";

export const SoundEffects = {
  hover(): void {
    audioManager.play("hover");
  },

  focus(): void {
    audioManager.play("focus");
  },

  transition(): void {
    audioManager.play("transition");
  },
} as const;
