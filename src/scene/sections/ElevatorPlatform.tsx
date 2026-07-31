import { useMemo, type JSX } from "react";
import {
  accentForCategory,
  ELEVATOR_CONFIG,
  type ElevatorPlatformSlot,
} from "@config/elevator";
import { MODEL_ASSETS } from "@config/assets";
import { FloatingCard } from "@components/cards/FloatingCard";
import { GlbProp } from "@scene/objects/GlbProp";
import { timelineObjectId } from "@utils/elevatorIds";
import { useElevatorStore } from "@store/elevatorStore";
import { useExperienceStore } from "@store/experienceStore";

interface ElevatorPlatformProps {
  platform: ElevatorPlatformSlot;
  radius: number;
  cardModelScale: number;
  /** When set, overrides default dimming (used by small Z-stack). */
  dimmedOverride?: boolean;
  /** Small stairs carousel — card only, no platform / ring underglow. */
  hideFloor?: boolean;
}

/**
 * Single milestone floor + interactive year card.
 */
export function ElevatorPlatform({
  platform,
  radius,
  cardModelScale,
  dimmedOverride,
  hideFloor = false,
}: ElevatorPlatformProps): JSX.Element {
  const accent = accentForCategory(platform.category);
  const selectedEventId = useElevatorStore((s) => s.selectedEventId);
  const hoveredObjectId = useExperienceStore((s) => s.hoveredObjectId);
  const objectId = timelineObjectId(platform.id);
  const isSelected = selectedEventId === platform.id;
  const isHovered = hoveredObjectId === objectId;
  const emissive = isSelected ? 1.35 : isHovered ? 1.05 : 0.55;
  const dimmed = isSelected
    ? false
    : (dimmedOverride ?? !isHovered);

  const floorScale = useMemo(
    (): [number, number, number] => [radius * 0.55, 0.55, radius * 0.55],
    [radius],
  );

  const cardY = hideFloor ? 0 : ELEVATOR_CONFIG.cardOffsetY;
  const cardZ = hideFloor ? 0 : ELEVATOR_CONFIG.cardOffsetZ;

  return (
    <group position={[0, platform.localY, 0]}>
      {!hideFloor ? (
        <>
          <GlbProp
            url={MODEL_ASSETS.hologramPlatform}
            color={accent}
            preset="neonGlass"
            scale={floorScale}
            emissiveIntensity={emissive}
            skipRaycast
          />

          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.02, 0]}
            raycast={() => {}}
          >
            <ringGeometry args={[radius * 0.55, radius * 0.92, 48]} />
            <meshBasicMaterial
              color={accent}
              transparent
              opacity={isSelected || isHovered ? 0.35 : 0.14}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </>
      ) : null}

      <FloatingCard
        id={objectId}
        variant="timeline"
        title={platform.yearLabel}
        sectionLabel={platform.isFuture ? "Next Chapter" : "Timeline"}
        subtitle={platform.title}
        bodyLines={[platform.description]}
        coverUrl={platform.media}
        position={[0, cardY, cardZ]}
        phase={platform.index * 0.7}
        accentOverride={accent}
        modelScaleOverride={cardModelScale}
        floatAmplitudeOverride={hideFloor ? 0 : ELEVATOR_CONFIG.floatAmplitude}
        forceOverview
        dimmed={dimmed}
      />
    </group>
  );
}
