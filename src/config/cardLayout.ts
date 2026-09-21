import type { Vector3Tuple } from "three";
import { CORRIDOR_LAYOUT, laneY } from "@config/corridor";

/**
 * Depth corridor + camera stand-off.
 * Distances raised for CARD_MODEL_SCALE 2.4 so framed cards stay readable.
 */
export const CARD_LAYOUT = {
  eyeHeight: 0.35,
  cameraDistance: {
    hero: 6.2,
    project: 5.8,
    skill: 5.4,
    experience: 5.8,
    timeline: 5.4,
    certificate: 5.8,
    contact: 6.2,
  },
  explore: {
    /** Start overview — ~1/3 closer than the original z=16 stand-off. */
    cameraPosition: [0, 1.8, 10.67] as Vector3Tuple,
    lookAt: [0, laneY("center"), CORRIDOR_LAYOUT.sectionZ.hero] as Vector3Tuple,
  },
  /**
   * Cards face the camera (no yaw). Lateral placements stay parallel to XY
   * so on-glass text stays readable.
   */
  cardRotation: [0, 0, 0] as Vector3Tuple,
} as const;

export type CardLayoutKind = keyof typeof CARD_LAYOUT.cameraDistance;

export function cameraForCard(
  position: Vector3Tuple,
  kind: CardLayoutKind,
): { cameraPosition: Vector3Tuple; lookAt: Vector3Tuple } {
  const distance = CARD_LAYOUT.cameraDistance[kind];
  const [x, y, z] = position;
  return {
    cameraPosition: [x, y + CARD_LAYOUT.eyeHeight, z + distance],
    lookAt: [x, y, z],
  };
}

export function placementWithCamera(
  position: Vector3Tuple,
  kind: CardLayoutKind,
): {
  position: Vector3Tuple;
  cameraPosition: Vector3Tuple;
  lookAt: Vector3Tuple;
} {
  const camera = cameraForCard(position, kind);
  return {
    position,
    cameraPosition: camera.cameraPosition,
    lookAt: camera.lookAt,
  };
}

/** Compresses lateral corridor spacing for mid / small viewports. */
export function scaleCorridorPosition(
  position: Vector3Tuple,
  scaleX: number,
): Vector3Tuple {
  if (scaleX === 1) {
    return position;
  }
  return [position[0] * scaleX, position[1], position[2]];
}
