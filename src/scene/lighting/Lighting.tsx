import type { JSX } from "react";
import { LIGHTING_CONFIG } from "@config/lighting";
import { AccentLights } from "@scene/lighting/AccentLights";
import { EmissiveLights } from "@scene/lighting/EmissiveLights";

export function Lighting(): JSX.Element {
  return (
    <>
      <ambientLight
        intensity={LIGHTING_CONFIG.ambient.intensity}
        color={LIGHTING_CONFIG.ambient.color}
      />
      <directionalLight
        intensity={LIGHTING_CONFIG.directional.intensity}
        color={LIGHTING_CONFIG.directional.color}
        position={LIGHTING_CONFIG.directional.position}
      />
      <AccentLights />
      <EmissiveLights />
    </>
  );
}
