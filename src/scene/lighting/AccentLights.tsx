import type { JSX } from "react";
import { LIGHTING_CONFIG } from "@config/lighting";

export function AccentLights(): JSX.Element {
  return (
    <>
      {LIGHTING_CONFIG.accents.map((light) => (
        <pointLight
          key={light.id}
          color={light.color}
          intensity={light.intensity}
          distance={light.distance}
          position={light.position}
          decay={2}
        />
      ))}
    </>
  );
}
