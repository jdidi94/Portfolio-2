/** Stable object ids for Infinite Elevator platforms + overview. */
export const ELEVATOR_WAYPOINT_ID = "timeline-elevator";

/** Closer stand-off while a milestone HTML panel is open. */
export const ELEVATOR_DETAIL_WAYPOINT_ID = "timeline-elevator-detail";

/** Synthetic top platform — invitation, not a résumé milestone. */
export const ELEVATOR_FUTURE_ID = "future";

const TIMELINE_PREFIX = "timeline-";

export function timelineObjectId(eventId: string): string {
  return `${TIMELINE_PREFIX}${eventId}`;
}

export function isTimelineObjectId(objectId: string): boolean {
  return (
    objectId.startsWith(TIMELINE_PREFIX) &&
    objectId !== ELEVATOR_WAYPOINT_ID &&
    objectId !== ELEVATOR_DETAIL_WAYPOINT_ID
  );
}

export function timelineIdFromObjectId(objectId: string): string | null {
  if (!isTimelineObjectId(objectId)) {
    return null;
  }
  return objectId.slice(TIMELINE_PREFIX.length);
}

export function isElevatorObjectId(objectId: string): boolean {
  return (
    objectId === ELEVATOR_WAYPOINT_ID ||
    objectId === ELEVATOR_DETAIL_WAYPOINT_ID ||
    isTimelineObjectId(objectId)
  );
}

export function isElevatorOverviewOrDetail(objectId: string): boolean {
  return (
    objectId === ELEVATOR_WAYPOINT_ID ||
    objectId === ELEVATOR_DETAIL_WAYPOINT_ID
  );
}
