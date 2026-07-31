/** Stable object ids for Project Carousel cards + overview. */
export const PROJECT_CAROUSEL_WAYPOINT_ID = "projects-carousel";

export function projectObjectId(projectId: string): string {
  return `project-${projectId}`;
}

export function isProjectObjectId(objectId: string): boolean {
  return objectId.startsWith("project-");
}

export function projectIdFromObjectId(objectId: string): string | null {
  if (!isProjectObjectId(objectId)) {
    return null;
  }
  return objectId.slice("project-".length);
}
