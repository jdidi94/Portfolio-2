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
  /** Extra space between title block and subtitle (design units @ 2048). */
  detailTitleToSubtitleGap: number;
  /** Extra space between subtitle block and body (design units @ 2048). */
  detailSubtitleToBodyGap: number;
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
  overviewTitleSize: 100,
  overviewTitleMaxLinesHex: 4,
  overviewTitleMaxLinesRect: 5,
  overviewTitleLineHeight: 138,
  overviewBodySize: 62,
  overviewBodyLineHeight: 83,
  overviewBodyMaxLinesPerBlock: 2,
  overviewBodyMaxBlocks: 4,
  overviewSectionSize: 80,
  overviewCtaSize: 57,
  /** Matches About detail rhythm — clear title / subtitle separation. */
  detailTitleSize: 100,
  detailTitleMaxLinesHex: 3,
  detailTitleMaxLinesRect: 3,
  detailTitleLineHeight: 132,
  detailSubtitleSize: 64,
  detailSubtitleMaxLines: 3,
  detailSubtitleLineHeight: 88,
  detailTitleToSubtitleGap: 72,
  detailSubtitleToBodyGap: 56,
  detailBodySize: 72,
  detailBodyLineHeight: 96,
  detailBodyMaxLinesPerBlock: 6,
  detailBodyMaxBlocks: 4,
  detailSectionSize: 56,
  bodyGrowMax: 0.85,
  bodyGrowMin: 0.55,
};

export function formatCardFaceTypeLog(params: CardFaceTypeParams): string {
  return [
    "[CardFaceTypeTuning] paste into CARD_FACE_TYPE_DEFAULTS:",
    JSON.stringify(params, null, 2),
  ].join("\n");
}
