import { create } from "zustand";
import {
  resolveElevatorLayout,
  clampPlatformIndex,
  defaultRideProgress,
} from "@config/elevator";
import { ELEVATOR_FUTURE_ID } from "@utils/elevatorIds";

interface ElevatorState {
  /** Open milestone panel target (event id or future). */
  selectedEventId: string | null;
  /** Nearest platform index — scene keeps this in sync during the ride. */
  rideIndex: number;
  /** Keyboard / select snap target; scene consumes and clears. */
  pendingSnapIndex: number | null;
  /** True while a panel is open. */
  isPaused: boolean;
  /** Bumped on user interaction — scene delays resume. */
  interactionEpoch: number;
  openMilestone: (eventId: string) => void;
  openCurrent: () => void;
  closePanel: () => void;
  /** Scene-only: keep rideIndex aligned without pausing ascent. */
  syncRideIndex: (index: number) => void;
  clearPendingSnap: () => void;
  step: (delta: number) => void;
  touchInteraction: () => void;
}

function platforms() {
  return resolveElevatorLayout("desktop").platforms;
}

function indexForEventId(eventId: string): number {
  const index = platforms().findIndex((p) => p.id === eventId);
  return index >= 0 ? index : 0;
}

/**
 * Selection + snap requests for the Infinite Elevator.
 * Continuous rise stays in R3F refs — not here.
 */
export const useElevatorStore = create<ElevatorState>((set, get) => ({
  selectedEventId: null,
  rideIndex: defaultRideProgress(resolveElevatorLayout("desktop")),
  pendingSnapIndex: null,
  isPaused: false,
  interactionEpoch: 0,

  openMilestone: (eventId) => {
    const index = indexForEventId(eventId);
    set({
      selectedEventId: eventId,
      rideIndex: index,
      pendingSnapIndex: index,
      isPaused: true,
      interactionEpoch: get().interactionEpoch + 1,
    });
  },

  openCurrent: () => {
    const list = platforms();
    const index = clampPlatformIndex(
      Math.round(get().rideIndex),
      list.length,
    );
    const platform = list[index];
    if (!platform) return;
    get().openMilestone(platform.id);
  },

  closePanel: () =>
    set({
      selectedEventId: null,
      isPaused: false,
      interactionEpoch: get().interactionEpoch + 1,
    }),

  syncRideIndex: (index) => {
    const next = clampPlatformIndex(index, platforms().length);
    if (next === get().rideIndex) return;
    set({ rideIndex: next });
  },

  clearPendingSnap: () => set({ pendingSnapIndex: null }),

  step: (delta) => {
    const count = platforms().length;
    if (count <= 0) return;
    const base = Math.round(get().rideIndex);
    const next = clampPlatformIndex(base + delta, count);
    set({
      rideIndex: next,
      pendingSnapIndex: next,
      interactionEpoch: get().interactionEpoch + 1,
    });
  },

  touchInteraction: () =>
    set({ interactionEpoch: get().interactionEpoch + 1 }),
}));

export function isFutureMilestone(eventId: string | null): boolean {
  return eventId === ELEVATOR_FUTURE_ID;
}
