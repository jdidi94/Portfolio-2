import { COLORS } from "@config/colors";
import { FLOAT_CONFIG } from "@config/float";
import type { WaypointConfig } from "@config/waypoints";
import { InteractionManager } from "@interaction/InteractionManager";
import { CursorManager } from "@interaction/CursorManager";
import { Float } from "@scene/objects/Float";
import { useExperienceStore } from "@store/experienceStore";
import type { JSX } from "react";

interface PlaceholderOrbProps {
  waypoint: WaypointConfig;
  color: string;
  phase: number;
}

function skipRaycast(): void {
  // Wireframe shell is visual-only.
}

export function PlaceholderOrb({
  waypoint,
  color,
  phase,
}: PlaceholderOrbProps): JSX.Element {
  const hoveredId = useExperienceStore((s) => s.hoveredObjectId);
  const focusId = useExperienceStore((s) => s.focusObjectId);
  const isHovered = hoveredId === waypoint.id;
  const isFocused = focusId === waypoint.id;

  return (
    <group position={waypoint.position}>
      <Float
        phase={phase}
        amplitude={FLOAT_CONFIG.orbAmplitude}
        speed={FLOAT_CONFIG.orbSpeed}
      >
        <mesh
          name={waypoint.id}
          onPointerOver={(event) => {
            event.stopPropagation();
            InteractionManager.onHover(waypoint.id);
            CursorManager.set("pointer");
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            InteractionManager.onUnhover(waypoint.id);
            CursorManager.reset();
          }}
          onClick={(event) => {
            event.stopPropagation();
            InteractionManager.onSelect(waypoint.id);
          }}
        >
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isFocused ? 2.4 : isHovered ? 1.8 : 1.1}
            metalness={0.7}
            roughness={0.25}
            transparent
            opacity={0.92}
            toneMapped={false}
          />
        </mesh>
        <mesh
          scale={isHovered || isFocused ? 1.35 : 1.15}
          raycast={skipRaycast}
        >
          <icosahedronGeometry args={[0.55, 1]} />
          <meshBasicMaterial
            color={COLORS.white}
            wireframe
            transparent
            opacity={isFocused ? 0.35 : 0.12}
          />
        </mesh>
      </Float>
    </group>
  );
}
