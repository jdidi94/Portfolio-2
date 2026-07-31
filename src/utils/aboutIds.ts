/** Stable object ids for the About character section. */
export const ABOUT_WAYPOINT_ID = "about";

export function aboutBeatObjectId(beatId: string): string {
  return `about-${beatId}`;
}

export function isAboutObjectId(objectId: string): boolean {
  return (
    objectId === ABOUT_WAYPOINT_ID || objectId.startsWith("about-")
  );
}

export function aboutBeatIdFromObjectId(objectId: string): string | null {
  if (!objectId.startsWith("about-")) {
    return null;
  }
  const beatId = objectId.slice("about-".length);
  return beatId.length > 0 ? beatId : null;
}
