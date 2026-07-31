import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  TECH_HIVE_LAYOUT_DEFAULTS,
  type TechHiveLayoutParams,
  resolveTechHiveLayout,
  formatTechHiveMeasuresLog,
  visibleTechCountForTier,
} from "@config/techHiveLayout";

interface TechHiveLayoutStore extends TechHiveLayoutParams {
  panelOpen: boolean;
  setParam: <K extends keyof TechHiveLayoutParams>(
    key: K,
    value: TechHiveLayoutParams[K],
  ) => void;
  setPanelOpen: (open: boolean) => void;
  reset: () => void;
  logMeasures: () => void;
}

function snapshotParams(state: TechHiveLayoutParams): TechHiveLayoutParams {
  return {
    parentScale: state.parentScale,
    childSpacing: state.childSpacing,
    childMargin: state.childMargin,
    childModelScale: state.childModelScale,
    clusterRotationZ: state.clusterRotationZ,
    cameraDistance: state.cameraDistance,
    cameraEyeHeight: state.cameraEyeHeight,
    cellCameraDistance: state.cellCameraDistance,
    visibleCountDesktop: state.visibleCountDesktop,
    visibleCountMid: state.visibleCountMid,
    floatAmplitude: state.floatAmplitude,
  };
}

export const useTechHiveLayoutStore = create<TechHiveLayoutStore>(
  (set, get) => ({
    ...TECH_HIVE_LAYOUT_DEFAULTS,
    panelOpen: false,
    setParam: (key, value) => set({ [key]: value }),
    setPanelOpen: (panelOpen) => set({ panelOpen }),
    reset: () => set({ ...TECH_HIVE_LAYOUT_DEFAULTS }),
    logMeasures: () => {
      const params = snapshotParams(get());
      const totalClusterCells = visibleTechCountForTier(params, "desktop");
      const childCount = totalClusterCells > 0 ? totalClusterCells - 1 : 0;
      const layout = resolveTechHiveLayout(params, childCount);
      // eslint-disable-next-line no-console -- intentional measure dump for fitting
      console.log(formatTechHiveMeasuresLog(params, layout));
      // eslint-disable-next-line no-console -- structured object for DevTools
      console.log("[TechHiveLayout] measures", layout.measures);
    },
  }),
);

/** Stable shallow selector — avoids infinite re-renders from new object identity. */
export function useTechHiveLayoutParams(): TechHiveLayoutParams {
  return useTechHiveLayoutStore(
    useShallow((state) => ({
      parentScale: state.parentScale,
      childSpacing: state.childSpacing,
      childMargin: state.childMargin,
      childModelScale: state.childModelScale,
      clusterRotationZ: state.clusterRotationZ,
      cameraDistance: state.cameraDistance,
      cameraEyeHeight: state.cameraEyeHeight,
      cellCameraDistance: state.cellCameraDistance,
      visibleCountDesktop: state.visibleCountDesktop,
      visibleCountMid: state.visibleCountMid,
      floatAmplitude: state.floatAmplitude,
    })),
  );
}
