import type { CardFaceShape } from "@config/cardGeometry";
import { CARD_MODEL_BOUNDS } from "@config/cardGeometry";

/**
 * Live-tunable parameters for the first section (hero) only.
 * Use the on-screen panel + "Log measures" to dial fit, then copy values here.
 */
export interface HeroFaceTuningParams {
  /** Content silhouette — should match the GLB placeholder opening. */
  shape: CardFaceShape;
  /**
   * Fraction of the placeholder opening filled before width/height scale.
   * 1 = exact AABB-inscribed silhouette (full hex fill for glass_card_rounded).
   */
  inset: number;
  /** Extra scale on face width (applied as mesh scale X). */
  widthScale: number;
  /** Extra scale on face height (applied as mesh scale Y). */
  heightScale: number;
  /** Pull content into the glass (positive = deeper into frame). */
  recess: number;
  /** Local offset of the content face (model-centered space). */
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  /** Rounded-rect corner radius as fraction of min(width,height). */
  cornerRadius: number;
  /** Override uniform model scale (null = use default from geometry). */
  modelScale: number | null;
  /** Draw a wireframe outline of the face bounds for measuring. */
  showMeasureHelper: boolean;
}

/**
 * Baked from logged measures (2026-07-25).
 * Face fills hex opening; modelScale 2.4 is shared by all card variants.
 */
export const HERO_FACE_FILL_PRESET: HeroFaceTuningParams = {
  shape: "hexagon",
  inset: 1,
  widthScale: 1,
  heightScale: 1,
  recess: 0.02,
  offsetX: 0,
  offsetY: 0,
  offsetZ: 0,
  cornerRadius: 0.08,
  modelScale: 2.4,
  showMeasureHelper: false,
};

/** Defaults for hero — baked from logged face-fit measures. */
export const HERO_FACE_TUNING_DEFAULTS: HeroFaceTuningParams = {
  ...HERO_FACE_FILL_PRESET,
};

/** Measured placeholder bounds for hero GLB (glass_card_rounded). */
export const HERO_PLACEHOLDER_BOUNDS = CARD_MODEL_BOUNDS.glassCardRounded;

export interface ResolvedHeroFaceLayout {
  shape: CardFaceShape;
  /** Unscaled geometry width (inset only) — mesh then applies widthScale. */
  faceWidth: number;
  /** Unscaled geometry height (inset only) — mesh then applies heightScale. */
  faceHeight: number;
  /** Visual size after width/height scale (what you see in the scene). */
  visualWidth: number;
  visualHeight: number;
  hexRadius: number;
  ellipseRx: number;
  ellipseRy: number;
  widthScale: number;
  heightScale: number;
  offset: [number, number, number];
  cornerRadius: number;
  modelScale: number | null;
  showMeasureHelper: boolean;
  /** Snapshot for console / paste-back into config. */
  measures: {
    placeholderSize: readonly [number, number, number];
    placeholderCenter: readonly [number, number, number];
    placeholderFrontZ: number;
    faceWidth: number;
    faceHeight: number;
    visualWidth: number;
    visualHeight: number;
    inset: number;
    widthScale: number;
    heightScale: number;
    recess: number;
    offset: readonly [number, number, number];
    shape: CardFaceShape;
  };
}

/**
 * Circumradius of a pointy-top hex that exactly fits the placeholder AABB.
 */
export function placeholderHexRadius(): number {
  const bounds = HERO_PLACEHOLDER_BOUNDS;
  return Math.min(bounds.size[1] / 2, bounds.size[0] / Math.sqrt(3));
}

/**
 * Resolve hero face size/offset from placeholder bounds + tuning params.
 *
 * Geometry is built at inset size; widthScale/heightScale are applied as
 * mesh scale so both axes actually resize the content (including hexagon).
 */
export function resolveHeroFaceLayout(
  params: HeroFaceTuningParams,
): ResolvedHeroFaceLayout {
  const bounds = HERO_PLACEHOLDER_BOUNDS;
  const inset = params.inset;

  const hexRadius = placeholderHexRadius() * inset;
  const ellipseRx = (bounds.size[0] / 2) * inset;
  const ellipseRy = (bounds.size[1] / 2) * inset;

  let faceWidth = bounds.size[0] * inset;
  let faceHeight = bounds.size[1] * inset;

  if (params.shape === "hexagon") {
    faceWidth = Math.sqrt(3) * hexRadius;
    faceHeight = 2 * hexRadius;
  } else if (params.shape === "ellipse") {
    faceWidth = ellipseRx * 2;
    faceHeight = ellipseRy * 2;
  } else if (params.shape === "triangle") {
    faceWidth = bounds.size[0] * inset;
    faceHeight = bounds.size[1] * inset;
  }

  const visualWidth = faceWidth * params.widthScale;
  const visualHeight = faceHeight * params.heightScale;

  const offset: [number, number, number] = [
    params.offsetX,
    params.offsetY,
    bounds.frontZ - bounds.center[2] - params.recess + params.offsetZ,
  ];

  return {
    shape: params.shape,
    faceWidth,
    faceHeight,
    visualWidth,
    visualHeight,
    hexRadius,
    ellipseRx,
    ellipseRy,
    widthScale: params.widthScale,
    heightScale: params.heightScale,
    offset,
    cornerRadius: params.cornerRadius,
    modelScale: params.modelScale,
    showMeasureHelper: params.showMeasureHelper,
    measures: {
      placeholderSize: bounds.size,
      placeholderCenter: bounds.center,
      placeholderFrontZ: bounds.frontZ,
      faceWidth,
      faceHeight,
      visualWidth,
      visualHeight,
      inset: params.inset,
      widthScale: params.widthScale,
      heightScale: params.heightScale,
      recess: params.recess,
      offset,
      shape: params.shape,
    },
  };
}

export function formatHeroMeasuresLog(
  params: HeroFaceTuningParams,
  layout: ResolvedHeroFaceLayout,
): string {
  return [
    "[HeroFaceTuning] paste into HERO_FACE_TUNING_DEFAULTS or share measures:",
    JSON.stringify(
      {
        params,
        measures: layout.measures,
      },
      null,
      2,
    ),
  ].join("\n");
}
