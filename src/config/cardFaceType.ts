/**
 * Canvas face typography — design units at 2048px texture height.
 * Live-tunable via CardFaceTypeTuningPanel; bake best values here.
 */
export interface CardFaceTypeParams {
  overviewTitleSize: number;
  overviewTitleMaxLinesHex: number;
  overviewTitleMaxLinesRect: number;
  overviewTitleLineHeight: number;
  overviewBodySize: number;
  overviewBodyLineHeight: number;
  overviewBodyMaxLinesPerBlock: number;
  overviewBodyMaxBlocks: number;
  /** Overview uppercase section label (was hardcoded 46). */
  overviewSectionSize: number;
  /** Overview “Tap to open” CTA (was hardcoded 36). */
  overviewCtaSize: number;
  detailTitleSize: number;
  detailTitleMaxLinesHex: number;
  detailTitleMaxLinesRect: number;
  detailTitleLineHeight: number;
  detailSubtitleSize: number;
  detailSubtitleMaxLines: number;
  detailSubtitleLineHeight: number;
  detailBodySize: number;
  detailBodyLineHeight: number;
  detailBodyMaxLinesPerBlock: number;
  detailBodyMaxBlocks: number;
  /** Detail uppercase section label (was hardcoded 38). */
  detailSectionSize: number;
  /** Modest fill — body must not outgrow title hierarchy. */
  bodyGrowMax: number;
  bodyGrowMin: number;
}

export const CARD_FACE_TYPE_DEFAULTS: CardFaceTypeParams = {
  overviewTitleSize: 128,
  overviewTitleMaxLinesHex: 2,
  overviewTitleMaxLinesRect: 2,
  overviewTitleLineHeight: 138,
  overviewBodySize: 62,
  overviewBodyLineHeight: 83,
  overviewBodyMaxLinesPerBlock: 2,
  overviewBodyMaxBlocks: 4,
  overviewSectionSize: 58,
  overviewCtaSize: 57,
  detailTitleSize: 115,
  detailTitleMaxLinesHex: 2,
  detailTitleMaxLinesRect: 3,
  detailTitleLineHeight: 128,
  detailSubtitleSize: 71,
  detailSubtitleMaxLines: 3,
  detailSubtitleLineHeight: 94,
  detailBodySize: 80,
  detailBodyLineHeight: 89,
  detailBodyMaxLinesPerBlock: 5,
  detailBodyMaxBlocks: 4,
  detailSectionSize: 72,
  bodyGrowMax: 1.15,
  bodyGrowMin: 0.9,
};

export function formatCardFaceTypeLog(params: CardFaceTypeParams): string {
  return [
    "[CardFaceTypeTuning] paste into CARD_FACE_TYPE_DEFAULTS:",
    JSON.stringify(params, null, 2),
  ].join("\n");
}
