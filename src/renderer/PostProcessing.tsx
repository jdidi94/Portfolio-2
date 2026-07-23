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
import { cameraMotion } from "@scene/camera/cameraMotion";
import { useExperienceStore } from "@store/experienceStore";
import { Vector3 } from "three";

export function PostProcessing(): JSX.Element | null {
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const focusTarget = useMemo(() => new Vector3(), []);

  useFrame(() => {
    focusTarget.copy(cameraMotion.lookAt);
  });

  if (prefersReducedMotion) {
    return null;
  }

  const { bloom, vignette, noise, depthOfField } = POSTPROCESSING_CONFIG;

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={bloom.intensity}
        luminanceThreshold={bloom.luminanceThreshold}
        luminanceSmoothing={bloom.luminanceSmoothing}
        mipmapBlur
      />
      <DepthOfField
        target={focusTarget}
        focalLength={depthOfField.focalLength}
        bokehScale={depthOfField.bokehScale}
        focusRange={depthOfField.focusRange}
      />
      <Noise opacity={noise.opacity} />
      <Vignette offset={vignette.offset} darkness={vignette.darkness} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
