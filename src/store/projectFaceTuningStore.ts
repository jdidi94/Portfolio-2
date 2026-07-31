import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  PROJECT_FACE_TUNING_DEFAULTS,
  type ProjectFaceTuningParams,
  resolveProjectFaceLayout,
  formatProjectMeasuresLog,
} from "@config/projectFaceTuning";

interface ProjectFaceTuningStore extends ProjectFaceTuningParams {
  panelOpen: boolean;
  setParam: <K extends keyof ProjectFaceTuningParams>(
    key: K,
    value: ProjectFaceTuningParams[K],
  ) => void;
  setPanelOpen: (open: boolean) => void;
  reset: () => void;
  logMeasures: () => void;
}

export const useProjectFaceTuningStore = create<ProjectFaceTuningStore>(
  (set, get) => ({
    ...PROJECT_FACE_TUNING_DEFAULTS,
    panelOpen: true,
    setParam: (key, value) => set({ [key]: value }),
    setPanelOpen: (panelOpen) => set({ panelOpen }),
    reset: () => set({ ...PROJECT_FACE_TUNING_DEFAULTS }),
    logMeasures: () => {
      const state = get();
      const params: ProjectFaceTuningParams = {
        shape: state.shape,
        inset: state.inset,
        widthScale: state.widthScale,
        heightScale: state.heightScale,
        recess: state.recess,
        offsetX: state.offsetX,
        offsetY: state.offsetY,
        offsetZ: state.offsetZ,
        rotationY: state.rotationY,
        cornerRadius: state.cornerRadius,
        modelScale: state.modelScale,
        showMeasureHelper: state.showMeasureHelper,
      };
      const layout = resolveProjectFaceLayout(params);
      // eslint-disable-next-line no-console -- intentional measure dump for fitting
      console.log(formatProjectMeasuresLog(params, layout));
      // eslint-disable-next-line no-console -- structured object for DevTools
      console.log("[ProjectFaceTuning] measures", layout.measures);
    },
  }),
);

/** Stable shallow selector — avoids infinite re-renders from new object identity. */
export function useProjectTuningParams(): ProjectFaceTuningParams {
  return useProjectFaceTuningStore(
    useShallow((state) => ({
      shape: state.shape,
      inset: state.inset,
      widthScale: state.widthScale,
      heightScale: state.heightScale,
      recess: state.recess,
      offsetX: state.offsetX,
      offsetY: state.offsetY,
      offsetZ: state.offsetZ,
      rotationY: state.rotationY,
      cornerRadius: state.cornerRadius,
      modelScale: state.modelScale,
      showMeasureHelper: state.showMeasureHelper,
    })),
  );
}
