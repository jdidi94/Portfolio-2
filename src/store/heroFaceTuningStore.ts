import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  HERO_FACE_TUNING_DEFAULTS,
  HERO_FACE_FILL_PRESET,
  type HeroFaceTuningParams,
  resolveHeroFaceLayout,
  formatHeroMeasuresLog,
} from "@config/heroFaceTuning";

interface HeroFaceTuningStore extends HeroFaceTuningParams {
  panelOpen: boolean;
  setParam: <K extends keyof HeroFaceTuningParams>(
    key: K,
    value: HeroFaceTuningParams[K],
  ) => void;
  setPanelOpen: (open: boolean) => void;
  reset: () => void;
  fillPlaceholder: () => void;
  logMeasures: () => void;
}

export const useHeroFaceTuningStore = create<HeroFaceTuningStore>((set, get) => ({
  ...HERO_FACE_TUNING_DEFAULTS,
  panelOpen: false,
  setParam: (key, value) => set({ [key]: value }),
  setPanelOpen: (panelOpen) => set({ panelOpen }),
  reset: () => set({ ...HERO_FACE_TUNING_DEFAULTS }),
  fillPlaceholder: () => set({ ...HERO_FACE_FILL_PRESET }),
  logMeasures: () => {
    const state = get();
    const params: HeroFaceTuningParams = {
      shape: state.shape,
      inset: state.inset,
      widthScale: state.widthScale,
      heightScale: state.heightScale,
      recess: state.recess,
      offsetX: state.offsetX,
      offsetY: state.offsetY,
      offsetZ: state.offsetZ,
      cornerRadius: state.cornerRadius,
      modelScale: state.modelScale,
      showMeasureHelper: state.showMeasureHelper,
    };
    const layout = resolveHeroFaceLayout(params);
    // eslint-disable-next-line no-console -- intentional measure dump for fitting
    console.log(formatHeroMeasuresLog(params, layout));
    // eslint-disable-next-line no-console -- structured object for DevTools
    console.log("[HeroFaceTuning] measures", layout.measures);
  },
}));

/** Stable shallow selector — avoids infinite re-renders from new object identity. */
export function useHeroTuningParams(): HeroFaceTuningParams {
  return useHeroFaceTuningStore(
    useShallow((state) => ({
      shape: state.shape,
      inset: state.inset,
      widthScale: state.widthScale,
      heightScale: state.heightScale,
      recess: state.recess,
      offsetX: state.offsetX,
      offsetY: state.offsetY,
      offsetZ: state.offsetZ,
      cornerRadius: state.cornerRadius,
      modelScale: state.modelScale,
      showMeasureHelper: state.showMeasureHelper,
    })),
  );
}
