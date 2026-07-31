import { useEffect, useMemo, useRef, type JSX } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import {
  LoopOnce,
  LoopRepeat,
  type AnimationAction,
  type Object3D,
} from "three";
import { MODEL_ASSETS } from "@config/assets";
import { ABOUT_CHARACTER_CONFIG } from "@config/aboutCharacter";
import { useExperienceStore } from "@store/experienceStore";
import { isAboutObjectId } from "@utils/aboutIds";

interface TravelerCharacterProps {
  /** When false, freeze on the first frame of the active clip. */
  playIdle?: boolean;
}

/** Session flag — first About visit greets; later visits pick randomly. */
let hasGreetedThisSession = false;

function pickRandomClip(
  pool: readonly string[],
  available: readonly string[],
  exclude?: string | null,
): string | null {
  const options = pool.filter(
    (name) => available.includes(name) && name !== exclude,
  );
  if (options.length === 0) {
    const fallback = available.find((name) => name !== exclude);
    return fallback ?? available[0] ?? null;
  }
  return options[Math.floor(Math.random() * options.length)] ?? null;
}

/**
 * Rigged traveler for the About section.
 * Faces the camera; greets on first visit, then cycles random clips.
 */
export function TravelerCharacter({
  playIdle = true,
}: TravelerCharacterProps): JSX.Element {
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const activeSection = useExperienceStore((s) => s.activeSection);
  const focusObjectId = useExperienceStore((s) => s.focusObjectId);
  const cameraDestinationId = useExperienceStore((s) => s.cameraDestinationId);

  const inAbout =
    activeSection === "about" ||
    (focusObjectId != null && isAboutObjectId(focusObjectId)) ||
    (cameraDestinationId != null && isAboutObjectId(cameraDestinationId));

  const { scene, animations } = useGLTF(MODEL_ASSETS.traveler);
  const clone = useMemo(() => SkeletonUtils.clone(scene) as Object3D, [scene]);
  const { actions, names, mixer } = useAnimations(animations, clone);

  const { scale, position, rotation, greetClip, clips, crossFadeSeconds } =
    ABOUT_CHARACTER_CONFIG.character;

  const currentClipRef = useRef<string | null>(null);
  const wasInAboutRef = useRef(false);

  useEffect(() => {
    if (!playIdle || prefersReducedMotion) {
      const freezeName =
        currentClipRef.current ??
        (actions[greetClip] != null ? greetClip : names[0]);
      if (!freezeName) {
        return;
      }
      const action = actions[freezeName];
      if (!action) {
        return;
      }
      Object.values(actions).forEach((entry) => {
        entry?.stop();
      });
      action.reset();
      action.setLoop(LoopRepeat, Infinity);
      action.play();
      action.paused = true;
      action.time = 0;
      return () => {
        action.stop();
      };
    }

    const available = names.filter((name) => actions[name] != null);
    if (available.length === 0) {
      return;
    }

    const fadeTo = (clipName: string, loopOnce: boolean): void => {
      const next = actions[clipName];
      if (!next) {
        return;
      }
      const previousName = currentClipRef.current;
      if (previousName && previousName !== clipName) {
        actions[previousName]?.fadeOut(crossFadeSeconds);
      }
      next.reset();
      next.setLoop(loopOnce ? LoopOnce : LoopRepeat, loopOnce ? 1 : Infinity);
      next.clampWhenFinished = loopOnce;
      next.fadeIn(crossFadeSeconds).play();
      currentClipRef.current = clipName;
    };

    const playNextRandom = (exclude?: string | null): void => {
      const nextName = pickRandomClip(clips, available, exclude);
      if (!nextName) {
        return;
      }
      fadeTo(nextName, true);
    };

    const onFinished = (event: { action: AnimationAction }): void => {
      if (!inAbout) {
        return;
      }
      const finishedName = Object.entries(actions).find(
        ([, action]) => action === event.action,
      )?.[0];
      playNextRandom(finishedName ?? currentClipRef.current);
    };

    mixer?.addEventListener("finished", onFinished);

    if (inAbout && !wasInAboutRef.current) {
      // Entering About — greet once per session, then random each visit.
      if (!hasGreetedThisSession && actions[greetClip] != null) {
        hasGreetedThisSession = true;
        fadeTo(greetClip, true);
      } else {
        playNextRandom(currentClipRef.current);
      }
    } else if (inAbout && currentClipRef.current == null) {
      if (!hasGreetedThisSession && actions[greetClip] != null) {
        hasGreetedThisSession = true;
        fadeTo(greetClip, true);
      } else {
        playNextRandom(null);
      }
    } else if (!inAbout && wasInAboutRef.current) {
      Object.values(actions).forEach((entry) => {
        entry?.fadeOut(crossFadeSeconds);
      });
      currentClipRef.current = null;
    }

    wasInAboutRef.current = inAbout;

    return () => {
      mixer?.removeEventListener("finished", onFinished);
    };
  }, [
    actions,
    names,
    mixer,
    greetClip,
    clips,
    crossFadeSeconds,
    prefersReducedMotion,
    playIdle,
    inAbout,
  ]);

  return (
    <primitive
      object={clone}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}

useGLTF.preload(MODEL_ASSETS.traveler);
