import type { JSX } from "react";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  DepthOfField,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { POSTPROCESSING_CONFIG } from "@config/postprocessing";
import { PERFORMANCE_CONFIG } from "@config/performance";
import { cameraMotion } from "@scene/camera/cameraMotion";
import { useExperienceStore } from "@store/experienceStore";
import { usePerformanceStore } from "@store/performanceStore";
import { useViewportStore } from "@store/viewportStore";
import { Vector3 } from "three";

/**
 * Atmosphere FX. Corridor haze + DoF veil distant sections into neon shapes;
 * DoF turns off in focus mode, on mid/small, and under adaptive quality load.
 */
export function PostProcessing(): JSX.Element | null {
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const mode = useExperienceStore((s) => s.mode);
  const quality = usePerformanceStore((s) => s.quality);
  const tier = useViewportStore((s) => s.tier);
  const focusTarget = useMemo(() => new Vector3(), []);

  useFrame(() => {
    focusTarget.copy(cameraMotion.lookAt);
  });

  if (prefersReducedMotion) {
    return null;
  }

  const qualityProfile = PERFORMANCE_CONFIG.quality[quality];
  const { bloom, bloomFocus, vignette, noise, depthOfField } =
    POSTPROCESSING_CONFIG;
  const isFocus = mode === "focus";
  const isTransition = mode === "transition";
  const activeBloom = isFocus ? bloomFocus : bloom;
  const allowDof =
    qualityProfile.enableDof && tier === PERFORMANCE_CONFIG.dofMinTier;
  const showDof =
    allowDof &&
    !isFocus &&
    (depthOfField.enabledInExplore ||
      (isTransition && depthOfField.enabledInTransition));
  const showNoise = qualityProfile.enableNoise;

  const bokehScale = isTransition
    ? depthOfField.transitionBokehScale
    : depthOfField.bokehScale;
  const focusRange = isTransition
    ? depthOfField.transitionFocusRange
    : depthOfField.focusRange;

  if (showDof && showNoise) {
    return (
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={activeBloom.intensity}
          luminanceThreshold={activeBloom.luminanceThreshold}
          luminanceSmoothing={activeBloom.luminanceSmoothing}
          mipmapBlur
        />
        <DepthOfField
          target={focusTarget}
          focalLength={depthOfField.focalLength}
          bokehScale={bokehScale}
          focusRange={focusRange}
        />
        <Noise opacity={noise.opacity} />
        <Vignette offset={vignette.offset} darkness={vignette.darkness} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    );
  }

  if (showDof) {
    return (
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={activeBloom.intensity}
          luminanceThreshold={activeBloom.luminanceThreshold}
          luminanceSmoothing={activeBloom.luminanceSmoothing}
          mipmapBlur
        />
        <DepthOfField
          target={focusTarget}
          focalLength={depthOfField.focalLength}
          bokehScale={bokehScale}
          focusRange={focusRange}
        />
        <Vignette offset={vignette.offset} darkness={vignette.darkness} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    );
  }

  if (showNoise) {
    return (
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={activeBloom.intensity}
          luminanceThreshold={activeBloom.luminanceThreshold}
          luminanceSmoothing={activeBloom.luminanceSmoothing}
          mipmapBlur
        />
        <Noise opacity={noise.opacity} />
        <Vignette offset={vignette.offset} darkness={vignette.darkness} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={activeBloom.intensity}
        luminanceThreshold={activeBloom.luminanceThreshold}
        luminanceSmoothing={activeBloom.luminanceSmoothing}
        mipmapBlur
      />
      <Vignette offset={vignette.offset} darkness={vignette.darkness} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
