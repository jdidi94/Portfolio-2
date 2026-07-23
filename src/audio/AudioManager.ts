import { Howl } from "howler";
import { AUDIO_CONFIG } from "@config/audio";
import { useExperienceStore } from "@store/experienceStore";

type SfxKey = "hover" | "focus" | "transition";

interface SoundBank {
  ambient: Howl | null;
  hover: Howl | null;
  focus: Howl | null;
  transition: Howl | null;
}

function createHowl(
  src: string,
  options: { loop?: boolean; volume: number; html5?: boolean },
): Howl | null {
  try {
    return new Howl({
      src: [src],
      loop: options.loop ?? false,
      volume: options.volume,
      preload: true,
      html5: options.html5 ?? false,
      onloaderror: () => {
        // Missing assets must not crash the experience.
      },
    });
  } catch {
    return null;
  }
}

class AudioManagerImpl {
  private bank: SoundBank = {
    ambient: null,
    hover: null,
    focus: null,
    transition: null,
  };

  private initialized = false;

  init(): void {
    if (this.initialized) {
      return;
    }

    const { sources, ambientVolume, sfxVolume, masterVolume } = AUDIO_CONFIG;

    // Ambient can use HTML5 streaming; short SFX stay on Web Audio for low latency.
    this.bank.ambient = createHowl(sources.ambient, {
      loop: true,
      volume: ambientVolume * masterVolume,
      html5: true,
    });
    this.bank.hover = createHowl(sources.hover, {
      volume: sfxVolume * masterVolume,
      html5: false,
    });
    this.bank.focus = createHowl(sources.focus, {
      volume: sfxVolume * masterVolume,
      html5: false,
    });
    this.bank.transition = createHowl(sources.transition, {
      volume: sfxVolume * masterVolume * 0.8,
      html5: false,
    });

    this.initialized = true;
  }

  enable(): void {
    this.init();
    useExperienceStore.getState().setAudioEnabled(true);
    this.bank.ambient?.play();
  }

  disable(): void {
    useExperienceStore.getState().setAudioEnabled(false);
    this.bank.ambient?.stop();
  }

  toggle(): void {
    const enabled = useExperienceStore.getState().isAudioEnabled;
    if (enabled) {
      this.disable();
      return;
    }
    this.enable();
  }

  play(key: SfxKey): void {
    if (!useExperienceStore.getState().isAudioEnabled) {
      return;
    }
    this.init();
    this.bank[key]?.play();
  }
}

export const audioManager = new AudioManagerImpl();
