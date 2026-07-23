/**
 * Raycasting is owned by React Three Fiber pointer events on interactive meshes.
 * This module documents the boundary and exposes hit-id helpers for tests.
 */
export function resolveHitObjectId(
  objectName: string | undefined,
): string | null {
  if (!objectName || objectName.length === 0) {
    return null;
  }
  return objectName;
}
