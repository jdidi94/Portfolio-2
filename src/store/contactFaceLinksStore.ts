import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  CONTACT_FACE_LINKS_DEFAULTS,
  formatContactFaceLinksLog,
  type ContactFaceLinksParams,
} from "@config/contactFaceLinks";

interface ContactFaceLinksStore extends ContactFaceLinksParams {
  panelOpen: boolean;
  setParam: <K extends keyof ContactFaceLinksParams>(
    key: K,
    value: ContactFaceLinksParams[K],
  ) => void;
  setPanelOpen: (open: boolean) => void;
  reset: () => void;
  logMeasures: () => void;
}

function snapshotParams(state: ContactFaceLinksParams): ContactFaceLinksParams {
  return {
    offsetX: state.offsetX,
    offsetY: state.offsetY,
    offsetZ: state.offsetZ,
    distanceFactor: state.distanceFactor,
    widthRem: state.widthRem,
    iconGapPx: state.iconGapPx,
  };
}

export const useContactFaceLinksStore = create<ContactFaceLinksStore>(
  (set, get) => ({
    ...CONTACT_FACE_LINKS_DEFAULTS,
    panelOpen: false,
    setParam: (key, value) => set({ [key]: value }),
    setPanelOpen: (panelOpen) => set({ panelOpen }),
    reset: () => set({ ...CONTACT_FACE_LINKS_DEFAULTS }),
    logMeasures: () => {
      const params = snapshotParams(get());
      // eslint-disable-next-line no-console -- intentional bake dump for fitting
      console.log(formatContactFaceLinksLog(params));
      // eslint-disable-next-line no-console -- structured object for DevTools
      console.log("[ContactFaceLinks] measures", params);
    },
  }),
);

/** Stable shallow selector — avoids infinite re-renders from new object identity. */
export function useContactFaceLinksParams(): ContactFaceLinksParams {
  return useContactFaceLinksStore(
    useShallow((state) => ({
      offsetX: state.offsetX,
      offsetY: state.offsetY,
      offsetZ: state.offsetZ,
      distanceFactor: state.distanceFactor,
      widthRem: state.widthRem,
      iconGapPx: state.iconGapPx,
    })),
  );
}
