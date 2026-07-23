import type { JSX } from "react";
import { ENVIRONMENT_CONFIG } from "@config/environment";

/** Soft emissive markers that reinforce accent color without extra lights. */
export function EmissiveLights(): JSX.Element {
  return (
    <group>
      {ENVIRONMENT_CONFIG.emissiveMarkers.map((marker) => (
        <mesh key={marker.id} position={marker.position}>
          <sphereGeometry args={[marker.radius, 16, 16]} />
          <meshStandardMaterial
            color={marker.color}
            emissive={marker.color}
            emissiveIntensity={marker.intensity}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
