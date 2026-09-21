/** Stable object ids for Technology Hive cells + overview. */
export const HIVE_WAYPOINT_ID = "technology-hive";

const TECH_CATEGORY_PREFIX = "tech-category-";

export function techObjectId(techId: string): string {
  return `tech-${techId}`;
}

export function techCategoryObjectId(categoryId: string): string {
  return `${TECH_CATEGORY_PREFIX}${categoryId}`;
}

export function isTechCategoryObjectId(objectId: string): boolean {
  return objectId.startsWith(TECH_CATEGORY_PREFIX);
}

export function isTechObjectId(objectId: string): boolean {
  return objectId.startsWith("tech-");
}

export function techIdFromObjectId(objectId: string): string | null {
  if (!isTechObjectId(objectId) || isTechCategoryObjectId(objectId)) {
    return null;
  }
  return objectId.slice("tech-".length);
}
