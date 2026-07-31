import { useRef, useEffect, type JSX } from "react";
import gsap from "gsap";
import type { Group } from "three";
import { FloatingCard } from "@components/cards/FloatingCard";
import { resolveTechHiveIconUrl } from "@config/techHiveIconMap";
import {
  resolveTechHiveVisual,
  type TechHiveGroupVisual,
} from "@config/techHiveVisual";
import { techObjectId } from "@utils/techIds";
import type { Technology } from "@shared-types/content";
import type { Vector3Tuple } from "three";

interface TechHiveChildProps {
  tech: Technology | null;
  index: number;
  id: string;
  position: Vector3Tuple;
  origin: Vector3Tuple;
  childModelScale: number;
  floatAmplitude: number;
  iconUrl?: string;
  visual: TechHiveGroupVisual;
}

/**
 * Single child hex card that animates from the parent center out to its
 * final position on mount, and reverses back on unmount.
 */
function TechHiveChild({
  tech,
  index,
  id,
  position,
  origin,
  childModelScale,
  floatAmplitude,
  iconUrl,
  visual,
}: TechHiveChildProps): JSX.Element {
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // Start at the hive parent origin (collapsed).
    group.position.set(origin[0], origin[1], origin[2]);
    group.scale.setScalar(0);

    const delay = index * 0.028;

    const tween = gsap.to(group.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: 0.55,
      delay,
      ease: "back.out(1.4)",
    });

    const scaleTween = gsap.to(group.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.4,
      delay,
      ease: "back.out(1.8)",
    });

    return () => {
      tween.kill();
      scaleTween.kill();
    };
  }, [index, origin, position]);

  if (!tech) {
    return (
      <group ref={groupRef}>
        <FloatingCard
          id={id}
          variant="skill"
          title="Locked"
          sectionLabel="Coming soon"
          position={[0, 0, 0]}
          phase={index * 0.73}
          logoOnly
          locked
          accentOverride={visual.color}
          modelKeyOverride={visual.modelKey}
          modelScaleOverride={childModelScale}
          floatAmplitudeOverride={floatAmplitude}
        />
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <FloatingCard
        id={id}
        variant="skill"
        title={tech.name}
        sectionLabel={visual.label}
        position={[0, 0, 0]}
        phase={index * 0.73}
        coverUrl={iconUrl}
        logoOnly
        accentOverride={visual.color}
        modelKeyOverride={visual.modelKey}
        modelScaleOverride={childModelScale}
        floatAmplitudeOverride={floatAmplitude}
      />
    </group>
  );
}

interface TechHiveChildrenProps {
  filledTechs: readonly (Technology | null)[];
  slotCount: number;
  childPositions: readonly Vector3Tuple[];
  origin: Vector3Tuple;
  childModelScale: number;
  floatAmplitude: number;
}

/**
 * Renders the full hex cluster of tech cards, each animating outward
 * from the parent center on mount.
 */
export function TechHiveChildren({
  filledTechs,
  slotCount,
  childPositions,
  origin,
  childModelScale,
  floatAmplitude,
}: TechHiveChildrenProps): JSX.Element {
  return (
    <group>
      {Array.from({ length: slotCount }).map((_, index) => {
        const position = childPositions[index];
        if (!position) return null;

        const tech = filledTechs[index] ?? null;
        if (!tech) return null;

        const id = techObjectId(tech.id);
        const iconUrl = resolveTechHiveIconUrl(tech.id) ?? undefined;
        const visual = resolveTechHiveVisual(tech);

        return (
          <TechHiveChild
            key={id}
            tech={tech}
            index={index}
            id={id}
            position={position}
            origin={origin}
            childModelScale={childModelScale}
            floatAmplitude={floatAmplitude}
            iconUrl={iconUrl}
            visual={visual}
          />
        );
      })}
    </group>
  );
}
