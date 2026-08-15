import { useEffect, useMemo, useRef, useState, type JSX } from "react";
import gsap from "gsap";
import type { Group } from "three";
import {
  resolveTechHiveLayout,
  visibleTechCountForTier,
} from "@config/techHiveLayout";
import { resolveTechHiveIconUrl } from "@config/techHiveIconMap";
import { sortTechnologiesForHiveCluster } from "@config/techHiveVisual";
import {
  MOBILE_NAV_CONFIG,
  mobileOrderedTechnologies,
} from "@config/mobileNav";
import { technologies } from "@data/technologies";
import type { Technology } from "@shared-types/content";
import { FloatingCard } from "@components/cards/FloatingCard";
import { TechHiveChildren } from "@scene/sections/TechHiveChildren";
import { useExperienceStore } from "@store/experienceStore";
import { useMobileNavStore } from "@store/mobileNavStore";
import { useTechHiveLayoutParams } from "@store/techHiveLayoutStore";
import { useTechHiveStore } from "@store/techHiveStore";
import { useViewportStore } from "@store/viewportStore";
import { HIVE_WAYPOINT_ID, techObjectId } from "@utils/techIds";

/**
 * Small: one tech logo at a time — unpops out, then pops the next in.
 */
function TechPopCarousel({
  itemIndex,
  origin,
}: {
  itemIndex: number;
  origin: readonly [number, number, number];
}): JSX.Element {
  const prefersReducedMotion = useExperienceStore(
    (s) => s.prefersReducedMotion,
  );
  const popRef = useRef<Group>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const visibleIdRef = useRef<string | null>(null);

  const ordered = useMemo(() => mobileOrderedTechnologies(), []);
  const targetTech = ordered[itemIndex] ?? ordered[0] ?? null;
  const [visibleTech, setVisibleTech] = useState<Technology | null>(targetTech);

  useEffect(() => {
    const group = popRef.current;
    if (!group || !targetTech) return;

    tweenRef.current?.kill();

    if (prefersReducedMotion) {
      visibleIdRef.current = targetTech.id;
      setVisibleTech(targetTech);
      group.scale.setScalar(1);
      return;
    }

    const popIn = (): void => {
      group.scale.setScalar(0.01);
      tweenRef.current = gsap.to(group.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: MOBILE_NAV_CONFIG.techPopInSeconds,
        ease: MOBILE_NAV_CONFIG.techPopInEase,
      });
    };

    // First mount — pop in only.
    if (visibleIdRef.current === null) {
      visibleIdRef.current = targetTech.id;
      setVisibleTech(targetTech);
      popIn();
      return () => {
        tweenRef.current?.kill();
      };
    }

    if (visibleIdRef.current === targetTech.id) {
      return;
    }

    // Unpop current card, swap content, then pop in.
    tweenRef.current = gsap.to(group.scale, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: MOBILE_NAV_CONFIG.techPopOutSeconds,
      ease: MOBILE_NAV_CONFIG.techPopOutEase,
      onComplete: () => {
        visibleIdRef.current = targetTech.id;
        setVisibleTech(targetTech);
        popIn();
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [targetTech, prefersReducedMotion]);

  if (!visibleTech) {
    return <group />;
  }

  const iconUrl = resolveTechHiveIconUrl(visibleTech.id);

  return (
    <group position={[origin[0], origin[1], origin[2]]}>
      <group ref={popRef} scale={0.01}>
        <FloatingCard
          key={visibleTech.id}
          id={techObjectId(visibleTech.id)}
          variant="skill"
          title={visibleTech.name}
          sectionLabel="Technology"
          subtitle={visibleTech.category}
          bodyLines={[visibleTech.description]}
          coverUrl={iconUrl ?? undefined}
          position={[0, 0, MOBILE_NAV_CONFIG.stackPeekZ]}
          phase={0}
          forceOverview
          floatAmplitudeOverride={0}
          modelScaleOverride={MOBILE_NAV_CONFIG.techCardModelScale}
        />
      </group>
    </group>
  );
}

/**
 * Technology section — hive on mid/desktop;
 * small: one-card pop / unpop carousel.
 */
export function TechHive(): JSX.Element | null {
  const tier = useViewportStore((s) => s.tier);
  const mode = useExperienceStore((s) => s.mode);
  const activeSection = useExperienceStore((s) => s.activeSection);
  const focusObjectId = useExperienceStore((s) => s.focusObjectId);
  const cameraDestinationId = useExperienceStore((s) => s.cameraDestinationId);
  const selectedTechId = useTechHiveStore((s) => s.selectedTechId);
  const itemIndex = useMobileNavStore((s) => s.itemIndex);
  const layoutParams = useTechHiveLayoutParams();

  const baseLimit = useMemo(
    () => visibleTechCountForTier(layoutParams, tier),
    [layoutParams, tier],
  );

  const techCount = useMemo(
    () => (baseLimit > 0 ? Math.max(0, baseLimit - 1) : 0),
    [baseLimit],
  );

  const filledTechs = useMemo(() => {
    if (techCount <= 0) return [];
    const clustered = sortTechnologiesForHiveCluster(
      technologies.filter((tech) => resolveTechHiveIconUrl(tech.id) !== null),
    );
    return clustered.slice(0, techCount);
  }, [techCount]);

  const slotCount = techCount;

  const layout = useMemo(
    () => resolveTechHiveLayout(layoutParams, slotCount),
    [layoutParams, slotCount],
  );

  const showChildren =
    mode !== "transition" &&
    (cameraDestinationId === HIVE_WAYPOINT_ID ||
      focusObjectId === HIVE_WAYPOINT_ID ||
      activeSection === "skills" ||
      selectedTechId !== null);

  if (tier === "small") {
    return <TechPopCarousel itemIndex={itemIndex} origin={layout.origin} />;
  }

  return (
    <group>
      <FloatingCard
        id={HIVE_WAYPOINT_ID}
        variant="skill"
        title="Technologies"
        sectionLabel="Technology Hive"
        position={layout.parentPosition}
        phase={0.2}
        forceOverview
        modelScaleOverride={layoutParams.parentScale}
        floatAmplitudeOverride={layoutParams.floatAmplitude}
      />

      {showChildren ? (
        <TechHiveChildren
          filledTechs={filledTechs}
          slotCount={slotCount}
          childPositions={layout.childPositions}
          origin={layout.origin}
          childModelScale={layoutParams.childModelScale}
          floatAmplitude={layoutParams.floatAmplitude}
        />
      ) : null}
    </group>
  );
}
