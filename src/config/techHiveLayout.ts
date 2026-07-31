import type { Vector3Tuple } from "three";
import { TECH_HIVE_CONFIG } from "@config/techHive";
import { hexOrbitPositions } from "@utils/hexGrid";

/**
 * Live-tunable Technology Hive layout.
 * Children orbit the parent card — spacing, scale, camera, and cluster rotation.
 */
export interface TechHiveLayoutParams {
  /** Uniform scale of the parent skillBadge hex frame. */
  parentScale: number;
  /** Center-to-center spacing between child hex cards. */
  childSpacing: number;
  /** Extra gap added on top of childSpacing. */
  childMargin: number;
  /** Uniform model scale for each child FloatingCard. */
  childModelScale: number;
  /** Rotation around local Z axis for the children cluster (radians). */
  clusterRotationZ: number;
  cameraDistance: number;
  cameraEyeHeight: number;
  /** Closer stand-off when focusing a single tech card. */
  cellCameraDistance: number;
  visibleCountDesktop: number;
  visibleCountMid: number;
  floatAmplitude: number;
}

export const TECH_HIVE_LAYOUT_DEFAULTS: TechHiveLayoutParams = {
  parentScale: 2.6,
  childSpacing: 1.45,
  childMargin: 0.2,
  childModelScale: 1.15,
  clusterRotationZ: 0,
  cameraDistance: 11.5,
  cameraEyeHeight: 0.2,
  cellCameraDistance: 4.8,
  visibleCountDesktop: 19,
  visibleCountMid: 13,
  floatAmplitude: 0.04,
};

export interface TechHiveClusterBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface ResolvedTechHiveLayout {
  origin: Vector3Tuple;
  parentPosition: Vector3Tuple;
  childPositions: Vector3Tuple[];
  childCount: number;
  effectiveSpacing: number;
  clusterBounds: TechHiveClusterBounds;
  measures: {
    origin: Vector3Tuple;
    parentPosition: Vector3Tuple;
    childCount: number;
    childPositions: Vector3Tuple[];
    clusterBounds: TechHiveClusterBounds;
    effectiveSpacing: number;
    cameraDistance: number;
    cameraEyeHeight: number;
  };
}

function emptyBounds(): TechHiveClusterBounds {
  return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
}

function computeBounds(
  positions: readonly Vector3Tuple[],
): TechHiveClusterBounds {
  if (positions.length === 0) return emptyBounds();
  let minX = positions[0][0];
  let maxX = positions[0][0];
  let minY = positions[0][1];
  let maxY = positions[0][1];
  for (let i = 1; i < positions.length; i += 1) {
    const [x, y] = positions[i];
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  return { minX, maxX, minY, maxY };
}

/**
 * Resolves parent position and child orbit positions.
 * Parent is placed at the hive section origin.
 * Children orbit around that same point, never occupying the center slot.
 */
export function resolveTechHiveLayout(
  params: TechHiveLayoutParams,
  childCount: number,
): ResolvedTechHiveLayout {
  const origin = TECH_HIVE_CONFIG.origin as Vector3Tuple;
  const parentPosition = origin;

  const effectiveSpacing = Math.max(
    0.01,
    params.childSpacing + params.childMargin,
  );

  const rawChildPositions =
    childCount > 0
      ? hexOrbitPositions(childCount, effectiveSpacing, origin)
      : [];

  const angle = params.clusterRotationZ;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const childPositions =
    Math.abs(angle) < 0.000001
      ? rawChildPositions
      : rawChildPositions.map(([x, y, z]) => {
          const dx = x - origin[0];
          const dy = y - origin[1];
          return [
            origin[0] + dx * cos - dy * sin,
            origin[1] + dx * sin + dy * cos,
            z,
          ] as Vector3Tuple;
        });

  const clusterBounds = computeBounds(childPositions);

  return {
    origin,
    parentPosition,
    childPositions,
    childCount,
    effectiveSpacing,
    clusterBounds,
    measures: {
      origin,
      parentPosition,
      childCount,
      childPositions: childPositions.map((p) => [p[0], p[1], p[2]] as Vector3Tuple),
      clusterBounds,
      effectiveSpacing,
      cameraDistance: params.cameraDistance,
      cameraEyeHeight: params.cameraEyeHeight,
    },
  };
}

export function formatTechHiveMeasuresLog(
  params: TechHiveLayoutParams,
  layout: ResolvedTechHiveLayout,
): string {
  return JSON.stringify({ params, measures: layout.measures }, null, 2);
}

export function visibleTechCountForTier(
  params: TechHiveLayoutParams,
  tier: "desktop" | "mid" | "small",
): number {
  if (tier === "small") return 0;
  if (tier === "mid") return params.visibleCountMid;
  return params.visibleCountDesktop;
}

/**
 * Returns the smallest full hexagon cluster size (including center)
 * >= `minCount`.
 *
 * Cluster sizes: 1, 7, 19, 37, ...
 */
export function nextHexClusterCellCount(minCount: number): number {
  if (minCount <= 1) return 1;

  const cellsForRing = (ring: number): number =>
    1 + 3 * ring * (ring + 1);

  let ring = 0;
  while (cellsForRing(ring) < minCount) {
    ring += 1;
    if (ring > 50) return cellsForRing(50);
  }

  return cellsForRing(ring);
}
