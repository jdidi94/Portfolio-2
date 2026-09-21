import { Suspense, useEffect, useMemo, useRef, useState, type JSX } from "react";
import gsap from "gsap";
import type { Group } from "three";
import {
  resolveTechHiveLayout,
  visibleTechCountForTier,
} from "@config/techHiveLayout";
import { resolveTechHiveIconUrl } from "@config/techHiveIconMap";
import {
  resolveTechHiveVisual,
  sortTechnologiesForHiveCluster,
} from "@config/techHiveVisual";
import {
  MOBILE_NAV_CONFIG,
  mobileTechRailItems,
  type MobileTechRailItem,
} from "@config/mobileNav";
import { technologies } from "@data/technologies";
import { FloatingCard } from "@components/cards/FloatingCard";
import { TechHiveChildren } from "@scene/sections/TechHiveChildren";
import { useExperienceStore } from "@store/experienceStore";
import { useMobileNavStore } from "@store/mobileNavStore";
import { useTechHiveLayoutParams } from "@store/techHiveLayoutStore";
import { useTechHiveStore } from "@store/techHiveStore";
import { useTechHiveLoadingStore } from "@store/techHiveLoadingStore";
import { useViewportStore } from "@store/viewportStore";
import { axialToWorld, hexSpiral } from "@utils/hexGrid";
import {
  HIVE_WAYPOINT_ID,
  techCategoryObjectId,
  techObjectId,
} from "@utils/techIds";

/** Suspense fallback — flips the HTML tech loading overlay on/off. */
function TechHiveLoadingFallback(): null {
  useEffect(() => {
    useTechHiveLoadingStore.getState().beginLoading();
    return () => {
      useTechHiveLoadingStore.getState().endLoading();
    };
  }, []);
  return null;
}
/**
 * Small: one category page — label at center, logos on surrounding hex cells.
 * Whole cluster pops / unpops on scroll.
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
  const cluster = MOBILE_NAV_CONFIG;
  const popRef = useRef<Group>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const visibleKeyRef = useRef<string | null>(null);

  const rail = useMemo(
    () => mobileTechRailItems(cluster.techPageSize),
    [cluster.techPageSize],
  );
  const targetItem = rail[itemIndex] ?? rail[0] ?? null;
  const [visibleItem, setVisibleItem] = useState<MobileTechRailItem | null>(
    targetItem,
  );

  useEffect(() => {
    const group = popRef.current;
    if (!group || !targetItem) return;

    const targetKey = targetItem.id;
    tweenRef.current?.kill();

    if (prefersReducedMotion) {
      visibleKeyRef.current = targetKey;
      setVisibleItem(targetItem);
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

    if (visibleKeyRef.current === null) {
      visibleKeyRef.current = targetKey;
      setVisibleItem(targetItem);
      popIn();
      return () => {
        tweenRef.current?.kill();
      };
    }

    if (visibleKeyRef.current === targetKey) {
      return;
    }

    tweenRef.current = gsap.to(group.scale, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: MOBILE_NAV_CONFIG.techPopOutSeconds,
      ease: MOBILE_NAV_CONFIG.techPopOutEase,
      onComplete: () => {
        visibleKeyRef.current = targetKey;
        setVisibleItem(targetItem);
        popIn();
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [targetItem, prefersReducedMotion]);

  const cells = useMemo(() => {
    if (!visibleItem) return [];
    return hexSpiral(1 + visibleItem.techs.length);
  }, [visibleItem]);

  if (!visibleItem) {
    return <group />;
  }

  const spacing = cluster.techClusterSpacing;
  const labelCell = cells[0] ?? { q: 0, r: 0 };
  const labelPos = axialToWorld(labelCell.q, labelCell.r, spacing);

  return (
    <group position={[origin[0], origin[1], origin[2]]}>
      <Suspense fallback={<TechHiveLoadingFallback />}>
        <group
          ref={popRef}
          scale={0.01}
          rotation={[0, 0, cluster.techClusterRotationZ]}
        >
          <FloatingCard
            key={`label-${visibleItem.id}`}
            id={techCategoryObjectId(visibleItem.id)}
            variant="skill"
            title={visibleItem.label}
            sectionLabel="Category"
            position={[
              labelPos.x,
              labelPos.y,
              MOBILE_NAV_CONFIG.stackPeekZ,
            ]}
            phase={0}
            forceOverview
            floatAmplitudeOverride={0}
            modelScaleOverride={cluster.techCategoryLabelScale}
          />
          {visibleItem.techs.map((tech, index) => {
            const cell = cells[index + 1] ?? { q: 0, r: 0 };
            const pos = axialToWorld(cell.q, cell.r, spacing);
            const iconUrl = resolveTechHiveIconUrl(tech.id);
            const visual = resolveTechHiveVisual(tech);
            return (
              <FloatingCard
                key={tech.id}
                id={techObjectId(tech.id)}
                variant="skill"
                title={tech.name}
                sectionLabel={visibleItem.label}
                coverUrl={iconUrl ?? undefined}
                logoOnly
                accentOverride={visual.color}
                modelKeyOverride={visual.modelKey}
                position={[pos.x, pos.y, MOBILE_NAV_CONFIG.stackPeekZ]}
                phase={index * 0.12}
                floatAmplitudeOverride={0}
                modelScaleOverride={cluster.techCardModelScale}
              />
            );
          })}
        </group>
      </Suspense>
    </group>
  );
}

/**
 * Technology section — hive on mid/desktop;
 * small: category cluster pop / unpop (label surrounded by logos).
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
        <Suspense fallback={<TechHiveLoadingFallback />}>
          <TechHiveChildren
            filledTechs={filledTechs}
            slotCount={slotCount}
            childPositions={layout.childPositions}
            origin={layout.origin}
            childModelScale={layoutParams.childModelScale}
            floatAmplitude={layoutParams.floatAmplitude}
          />
        </Suspense>
      ) : null}
    </group>
  );
}
