/** Stable object ids for Technology Hive cells + overview. */
export const HIVE_WAYPOINT_ID = "technology-hive";

export function techObjectId(techId: string): string {
  return `tech-${techId}`;
}

export function isTechObjectId(objectId: string): boolean {
  return objectId.startsWith("tech-");
}

export function techIdFromObjectId(objectId: string): string | null {
  if (!isTechObjectId(objectId)) {
    return null;
  }
  return objectId.slice("tech-".length);
}
