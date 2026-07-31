import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  CARD_EDGE_FOG_TUNING_DEFAULTS,
  formatCardEdgeFogLog,
  type CardEdgeFogTuningParams,
} from "@config/cardEdgeFog";

interface CardEdgeFogTuningStore extends CardEdgeFogTuningParams {
  panelOpen: boolean;
  setParam: <K extends keyof CardEdgeFogTuningParams>(
    key: K,
    value: CardEdgeFogTuningParams[K],
  ) => void;
  setPanelOpen: (open: boolean) => void;
  reset: () => void;
  logMeasures: () => void;
}

function snapshotParams(
  state: CardEdgeFogTuningParams,
): CardEdgeFogTuningParams {
  return {
    blurPx: state.blurPx,
    hexClear: state.hexClear,
    softBand: state.softBand,
    circleFadeStart: state.circleFadeStart,
    circleFadeEnd: state.circleFadeEnd,
    planeScale: state.planeScale,
    opacity: state.opacity,
    zOffset: state.zOffset,
    frameEmissiveBoost: state.frameEmissiveBoost,
    skillBadgeFrameBoost: state.skillBadgeFrameBoost,
  };
}

export const useCardEdgeFogTuningStore = create<CardEdgeFogTuningStore>(
  (set, get) => ({
    ...CARD_EDGE_FOG_TUNING_DEFAULTS,
    panelOpen: true,
    setParam: (key, value) => set({ [key]: value }),
    setPanelOpen: (panelOpen) => set({ panelOpen }),
    reset: () => set({ ...CARD_EDGE_FOG_TUNING_DEFAULTS }),
    logMeasures: () => {
      const params = snapshotParams(get());
      // eslint-disable-next-line no-console -- intentional measure dump for fitting
      console.log(formatCardEdgeFogLog(params));
      // eslint-disable-next-line no-console -- structured object for DevTools
      console.log("[CardEdgeFogTuning] measures", params);
    },
  }),
);

/** Stable shallow selector — avoids infinite re-renders from new object identity. */
export function useCardEdgeFogTuningParams(): CardEdgeFogTuningParams {
  return useCardEdgeFogTuningStore(
    useShallow((state) => ({
      blurPx: state.blurPx,
      hexClear: state.hexClear,
      softBand: state.softBand,
      circleFadeStart: state.circleFadeStart,
      circleFadeEnd: state.circleFadeEnd,
      planeScale: state.planeScale,
      opacity: state.opacity,
      zOffset: state.zOffset,
      frameEmissiveBoost: state.frameEmissiveBoost,
      skillBadgeFrameBoost: state.skillBadgeFrameBoost,
    })),
  );
}
