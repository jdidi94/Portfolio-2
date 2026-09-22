import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  CARD_FACE_TYPE_DEFAULTS,
  formatCardFaceTypeLog,
  type CardFaceTypeParams,
} from "@config/cardFaceType";

interface CardFaceTypeStore extends CardFaceTypeParams {
  panelOpen: boolean;
  setParam: <K extends keyof CardFaceTypeParams>(
    key: K,
    value: CardFaceTypeParams[K],
  ) => void;
  setPanelOpen: (open: boolean) => void;
  reset: () => void;
  logMeasures: () => void;
}

function pickParams(state: CardFaceTypeStore): CardFaceTypeParams {
  return {
    overviewTitleSize: state.overviewTitleSize,
    overviewTitleMaxLinesHex: state.overviewTitleMaxLinesHex,
    overviewTitleMaxLinesRect: state.overviewTitleMaxLinesRect,
    overviewTitleLineHeight: state.overviewTitleLineHeight,
    overviewBodySize: state.overviewBodySize,
    overviewBodyLineHeight: state.overviewBodyLineHeight,
    overviewBodyMaxLinesPerBlock: state.overviewBodyMaxLinesPerBlock,
    overviewBodyMaxBlocks: state.overviewBodyMaxBlocks,
    overviewSectionSize: state.overviewSectionSize,
    overviewCtaSize: state.overviewCtaSize,
    detailTitleSize: state.detailTitleSize,
    detailTitleMaxLinesHex: state.detailTitleMaxLinesHex,
    detailTitleMaxLinesRect: state.detailTitleMaxLinesRect,
    detailTitleLineHeight: state.detailTitleLineHeight,
    detailSubtitleSize: state.detailSubtitleSize,
    detailSubtitleMaxLines: state.detailSubtitleMaxLines,
    detailSubtitleLineHeight: state.detailSubtitleLineHeight,
    detailTitleToSubtitleGap: state.detailTitleToSubtitleGap,
    detailSubtitleToBodyGap: state.detailSubtitleToBodyGap,
    detailBodySize: state.detailBodySize,
    detailBodyLineHeight: state.detailBodyLineHeight,
    detailBodyMaxLinesPerBlock: state.detailBodyMaxLinesPerBlock,
    detailBodyMaxBlocks: state.detailBodyMaxBlocks,
    detailSectionSize: state.detailSectionSize,
    bodyGrowMax: state.bodyGrowMax,
    bodyGrowMin: state.bodyGrowMin,
  };
}

/**
 * Live typography for all card faces (shared across sections).
 * Bake with Log measures → CARD_FACE_TYPE_DEFAULTS.
 */
export const useCardFaceTypeStore = create<CardFaceTypeStore>((set, get) => ({
  ...CARD_FACE_TYPE_DEFAULTS,
  panelOpen: true,
  setParam: (key, value) => set({ [key]: value }),
  setPanelOpen: (panelOpen) => set({ panelOpen }),
  reset: () => set({ ...CARD_FACE_TYPE_DEFAULTS }),
  logMeasures: () => {
    const params = pickParams(get());
    // eslint-disable-next-line no-console -- intentional measure dump for baking
    console.log(formatCardFaceTypeLog(params));
  },
}));

/** Stable shallow selector — avoids infinite re-renders from new object identity. */
export function useCardFaceTypeParams(): CardFaceTypeParams {
  return useCardFaceTypeStore(useShallow((state) => pickParams(state)));
}
