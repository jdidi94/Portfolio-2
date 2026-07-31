import type { CardFaceShape } from "@config/cardGeometry";
import { CARD_MODEL_BOUNDS } from "@config/cardGeometry";

/**
 * Live-tunable parameters for project cards only (`glass_card_base`).
 * Use the on-screen panel + "Log measures" to dial fit, then copy values here.
 */
export interface ProjectFaceTuningParams {
  /** Content silhouette — should match the GLB placeholder opening. */
  shape: CardFaceShape;
  /**
   * Fraction of the placeholder opening filled before width/height scale.
   * 1 = exact AABB-inscribed silhouette.
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
  /**
   * Face-only Y rotation in degrees — matches the model’s baked front-plane
   * tilt (e.g. right side leaning back).
   */
  rotationY: number;
  /** Rounded-rect corner radius as fraction of min(width,height). */
  cornerRadius: number;
  /** Override uniform model scale (null = use default from geometry). */
  modelScale: number | null;
  /** Draw a wireframe outline of the face bounds for measuring. */
  showMeasureHelper: boolean;
}

/**
 * Baked from logged measures (2026-07-25).
 * Face follows glass_card_base opening with +28° Y tilt.
 */
export const PROJECT_FACE_TUNING_DEFAULTS: ProjectFaceTuningParams = {
  shape: "roundedRect",
  inset: 0.85,
  widthScale: 1.29,
  heightScale: 1.169,
  recess: 0.037,
  offsetX: 0,
  offsetY: 0,
  offsetZ: -0.173,
  rotationY: 28,
  cornerRadius: 0.04,
  modelScale: null,
  showMeasureHelper: false,
};

/** Measured placeholder bounds for project GLB (glass_card_base). */
export const PROJECT_PLACEHOLDER_BOUNDS = CARD_MODEL_BOUNDS.glassCardBase;

export interface ResolvedProjectFaceLayout {
  shape: CardFaceShape;
  faceWidth: number;
  faceHeight: number;
  visualWidth: number;
  visualHeight: number;
  hexRadius: number;
  ellipseRx: number;
  ellipseRy: number;
  widthScale: number;
  heightScale: number;
  offset: [number, number, number];
  rotationY: number;
  cornerRadius: number;
  modelScale: number | null;
  showMeasureHelper: boolean;
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
    rotationY: number;
    offset: readonly [number, number, number];
    shape: CardFaceShape;
  };
}

export function projectFaceRotationRadians(
  params: ProjectFaceTuningParams,
): number {
  return (params.rotationY * Math.PI) / 180;
}

function placeholderHexRadius(): number {
  const bounds = PROJECT_PLACEHOLDER_BOUNDS;
  return Math.min(bounds.size[1] / 2, bounds.size[0] / Math.sqrt(3));
}

/**
 * Resolve project face size/offset/yaw from placeholder bounds + tuning.
 * Geometry is built at inset size; width/height scale apply as mesh scale.
 * Recess stays in world Z; rotationY tilts the face plate to match the glass.
 */
export function resolveProjectFaceLayout(
  params: ProjectFaceTuningParams,
): ResolvedProjectFaceLayout {
  const bounds = PROJECT_PLACEHOLDER_BOUNDS;
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
  const rotationY = projectFaceRotationRadians(params);

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
    rotationY,
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
      rotationY: params.rotationY,
      offset,
      shape: params.shape,
    },
  };
}

export function formatProjectMeasuresLog(
  params: ProjectFaceTuningParams,
  layout: ResolvedProjectFaceLayout,
): string {
  return [
    "[ProjectFaceTuning] paste into PROJECT_FACE_TUNING_DEFAULTS or share measures:",
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
