import type { Vector3Tuple } from "three";

/** Axial hex coordinates (pointy-top honeycomb). */
export interface HexAxial {
  q: number;
  r: number;
}

/**
 * Pointy-top axial → local XY on the hive plane.
 * `spacing` is true center-to-center distance between adjacent hexes.
 */
export function axialToWorld(
  q: number,
  r: number,
  spacing: number,
): { x: number; y: number } {
  const x = spacing * (q + r / 2);
  const y = spacing * ((Math.sqrt(3) / 2) * r);
  return { x, y };
}

/**
 * Align the axial grid so the resulting hex cluster's top/bottom vertices match
 * the card-face orientation (pointy-top).
 *
 * This is a fixed orientation correction so the cluster "disposition" is
 * correct by default; it is separate from any user-facing rotation controls.
 */
const HIVE_GRID_ALIGNMENT_ROTATION = Math.PI / 6;

/**
 * Spiral ring order centered at (0,0) — supports infinite expansion.
 * Returns `count` cells including the origin.
 * Ring walk uses axial neighbor directions in cyclic order (Red Blob Games).
 */
export function hexSpiral(count: number): readonly HexAxial[] {
  if (count <= 0) {
    return [];
  }

  const cells: HexAxial[] = [{ q: 0, r: 0 }];
  if (count === 1) {
    return cells;
  }

  // Clockwise neighbor vectors — must stay on the ring perimeter.
  const directions: readonly HexAxial[] = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
  ];

  let ring = 1;
  while (cells.length < count) {
    // Start at cube direction 4 scaled by radius: axial (-ring, +ring).
    let q = -ring;
    let r = ring;
    for (const dir of directions) {
      for (let step = 0; step < ring; step += 1) {
        cells.push({ q, r });
        if (cells.length >= count) {
          return cells;
        }
        q += dir.q;
        r += dir.r;
      }
    }
    ring += 1;
  }

  return cells;
}

/**
 * Hexagon cluster for an exact cell `count`.
 *
 * Like `hexSpiral`, but when the last ring is partial, it centers that partial
 * segment so the cluster looks like a symmetric hexagon (not an "edge-start"
 * wedge).
 */
function hexClusterCentered(count: number): readonly HexAxial[] {
  if (count <= 0) {
    return [];
  }

  // Total cells up to ring R (inclusive): 1 + 6*(1+2+...+R) = 1 + 3R(R+1)
  const totalCellsForRing = (ring: number): number =>
    1 + 3 * ring * (ring + 1);

  const cells: HexAxial[] = [{ q: 0, r: 0 }];
  if (count === 1) {
    return cells;
  }

  let fullRing = 0;
  while (fullRing + 1 < 999 && totalCellsForRing(fullRing + 1) <= count) {
    fullRing += 1;
  }

  // Append all full rings.
  for (let ring = 1; ring <= fullRing; ring += 1) {
    const ringCells = hexRingAxials(ring);
    cells.push(...ringCells);
  }

  const remaining = count - cells.length;
  if (remaining <= 0) {
    return cells;
  }

  const partialRing = fullRing + 1;
  const ringCells = hexRingAxials(partialRing);
  const ringSize = ringCells.length;

  // Center a contiguous segment of `remaining` cells on the ring.
  const startIndex = Math.floor((ringSize - remaining) / 2);
  for (let i = 0; i < remaining; i += 1) {
    cells.push(ringCells[(startIndex + i) % ringSize]);
  }

  return cells;
}

function hexRingAxials(ring: number): readonly HexAxial[] {
  // Clockwise neighbor vectors — must stay on the ring perimeter.
  const directions: readonly HexAxial[] = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
  ];

  // Start at cube direction 4 scaled by radius: axial (-ring, +ring).
  let q = -ring;
  let r = ring;
  const cells: HexAxial[] = [];

  for (const dir of directions) {
    for (let step = 0; step < ring; step += 1) {
      cells.push({ q, r });
      q += dir.q;
      r += dir.r;
    }
  }

  return cells;
}

export function hexWorldPositions(
  count: number,
  spacing: number,
  origin: Vector3Tuple,
): Vector3Tuple[] {
  const [ox, oy, oz] = origin;
  const cos = Math.cos(HIVE_GRID_ALIGNMENT_ROTATION);
  const sin = Math.sin(HIVE_GRID_ALIGNMENT_ROTATION);
  return hexClusterCentered(count).map(({ q, r }) => {
    const { x: lx, y: ly } = axialToWorld(q, r, spacing);
    // Rotate local grid so top/bottom vertices align with expected "up/down".
    const x = lx * cos - ly * sin;
    const y = lx * sin + ly * cos;
    return [ox + x, oy + y, oz] as Vector3Tuple;
  });
}

/**
 * Hex positions for children that orbit *around* a parent at `origin`.
 * The center cell (q=0, r=0) is excluded — the parent occupies that slot.
 * `count` is the number of child slots needed.
 */
export function hexOrbitPositions(
  count: number,
  spacing: number,
  origin: Vector3Tuple,
): Vector3Tuple[] {
  if (count <= 0) return [];

  const [ox, oy, oz] = origin;
  const cos = Math.cos(HIVE_GRID_ALIGNMENT_ROTATION);
  const sin = Math.sin(HIVE_GRID_ALIGNMENT_ROTATION);

  // Orbit cells exclude the center. Total orbit cells up to ring R:
  // 6 * (1 + 2 + ... + R) = 3R(R+1)
  const orbitCellsForRing = (ring: number): number =>
    3 * ring * (ring + 1);

  const positions: Vector3Tuple[] = [];

  let fullRing = 0;
  while (fullRing + 1 < 999 && orbitCellsForRing(fullRing + 1) <= count) {
    fullRing += 1;
  }

  // Append all full rings (rings 1..fullRing).
  for (let ring = 1; ring <= fullRing; ring += 1) {
    const ringCells = hexRingAxials(ring);
    for (const cell of ringCells) {
      const { x: lx, y: ly } = axialToWorld(cell.q, cell.r, spacing);
      const x = lx * cos - ly * sin;
      const y = lx * sin + ly * cos;
      positions.push([ox + x, oy + y, oz] as Vector3Tuple);
    }
  }

  // Optional centered partial segment on the next ring.
  const remaining = count - positions.length;
  if (remaining <= 0) return positions;

  const partialRing = fullRing + 1;
  const ringCells = hexRingAxials(partialRing);
  const ringSize = ringCells.length;
  const startIndex = Math.floor((ringSize - remaining) / 2);

  for (let i = 0; i < remaining; i += 1) {
    const cell = ringCells[(startIndex + i) % ringSize];
    const { x: lx, y: ly } = axialToWorld(cell.q, cell.r, spacing);
    const x = lx * cos - ly * sin;
    const y = lx * sin + ly * cos;
    positions.push([ox + x, oy + y, oz] as Vector3Tuple);
  }

  return positions;
}
