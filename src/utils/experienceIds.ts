/** Stable object ids for Experience row cards + overview. */
export const EXPERIENCE_WAYPOINT_ID = "experience-overview";

export function experienceObjectId(experienceId: string): string {
  return `experience-${experienceId}`;
}

export function isExperienceObjectId(objectId: string): boolean {
  return (
    objectId === EXPERIENCE_WAYPOINT_ID ||
    (objectId.startsWith("experience-") &&
      objectId !== EXPERIENCE_WAYPOINT_ID)
  );
}

export function experienceIdFromObjectId(objectId: string): string | null {
  if (objectId === EXPERIENCE_WAYPOINT_ID) {
    return null;
  }
  if (!objectId.startsWith("experience-")) {
    return null;
  }
  return objectId.slice("experience-".length);
}
