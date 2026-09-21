/**
 * Contact card face-link Html placement.
 * Live-tunable via ContactFaceLinksTuningPanel; bake best values here after Log.
 */
export interface ContactFaceLinksParams {
  /** Local X on the glass face. */
  offsetX: number;
  /** Local Y on the glass face (model space). */
  offsetY: number;
  /** Extra Z beyond the model front plane. */
  offsetZ: number;
  /** Html distanceFactor — smaller = larger on screen. */
  distanceFactor: number;
  /** Overlay width in rem. */
  widthRem: number;
  /** Gap between icon buttons (px). */
  iconGapPx: number;
}

export const CONTACT_FACE_LINKS_DEFAULTS: ContactFaceLinksParams = {
  offsetX: 0.39,
  offsetY: 0.25,
  offsetZ: -0.025,
  distanceFactor: 1.7,
  widthRem: 11.5,
  iconGapPx: 6,
};

export function formatContactFaceLinksLog(
  params: ContactFaceLinksParams,
): string {
  return [
    "[ContactFaceLinks] paste into CONTACT_FACE_LINKS_DEFAULTS:",
    JSON.stringify(params, null, 2),
  ].join("\n");
}
