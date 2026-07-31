import type { Vector3Tuple } from "three";
import { MODEL_ASSETS } from "@config/assets";
import type { ContentCardVariant } from "@shared-types/content";

/**
 * Measured GLB bounds (Three.js Box3 from assets).
 * Origin is at the bottom of each mesh; face is the +Z side (toward camera).
 */
export interface CardModelBounds {
  size: Vector3Tuple;
  center: Vector3Tuple;
  frontZ: number;
}

/** Silhouette of the placeholder opening — content must match this. */
export type CardFaceShape = "hexagon" | "roundedRect" | "ellipse" | "triangle";

export const CARD_MODEL_BOUNDS = {
  glassCardBase: {
    size: [0.6699, 0.998, 0.4082],
    center: [0, 0.499, 0],
    frontZ: 0.2041,
  },
  glassCardRounded: {
    size: [0.8652, 0.998, 0.1543],
    center: [0, 0.499, 0],
    frontZ: 0.0771,
  },
  skillBadge: {
    size: [0.8652, 0.998, 0.1543],
    center: [0, 0.499, 0],
    frontZ: 0.0771,
  },
  contactPortal: {
    size: [0.584, 0.998, 0.6113],
    center: [0, 0.499, 0],
    frontZ: 0.3057,
  },
} as const satisfies Record<string, CardModelBounds>;

export type CardModelKey = keyof typeof CARD_MODEL_BOUNDS;

export const VARIANT_MODEL_KEY: Record<ContentCardVariant, CardModelKey> = {
  hero: "glassCardRounded",
  project: "glassCardBase",
  skill: "skillBadge",
  /** Contact uses a glass card model with hex face (same opening as hero). */
  contact: "glassCardRounded",
  experience: "glassCardBase",
  timeline: "skillBadge",
  certificate: "glassCardRounded",
};

/** Placeholder opening shape per model (from silhouette). */
export const FACE_SHAPE_BY_MODEL: Record<CardModelKey, CardFaceShape> = {
  glassCardBase: "roundedRect",
  glassCardRounded: "hexagon",
  skillBadge: "hexagon",
  contactPortal: "ellipse",
};

/**
 * Fill ratio of the placeholder opening.
 * 1 = content plate matches AABB-inscribed silhouette (logged hero fit).
 */
export const FACE_INSET_BY_MODEL: Record<CardModelKey, number> = {
  glassCardBase: 1,
  glassCardRounded: 1,
  skillBadge: 1,
  contactPortal: 1,
};

/** Recess into glass so content sits in the frame (logged hero value). */
export const FACE_RECESS = 0.02;

/**
 * Uniform world scale for every card GLB + face.
 * Baked from logged hero `modelScale: 2.4` (all assets share ~1.0 height).
 */
export const CARD_MODEL_SCALE = 2.4;

/** @deprecated Prefer CARD_MODEL_SCALE — kept for call sites that expect height. */
export const CARD_TARGET_HEIGHT =
  CARD_MODEL_SCALE * CARD_MODEL_BOUNDS.glassCardRounded.size[1];

export function boundsForVariant(variant: ContentCardVariant): CardModelBounds {
  return CARD_MODEL_BOUNDS[VARIANT_MODEL_KEY[variant]];
}

export function faceShapeForVariant(variant: ContentCardVariant): CardFaceShape {
  return FACE_SHAPE_BY_MODEL[VARIANT_MODEL_KEY[variant]];
}

export function faceShapeForModel(modelKey: CardModelKey): CardFaceShape {
  return FACE_SHAPE_BY_MODEL[modelKey];
}

/** Pointy-top hex circumradius from a specific card model AABB. */
export function hexRadiusForModel(modelKey: CardModelKey): number {
  const bounds = CARD_MODEL_BOUNDS[modelKey];
  const inset = FACE_INSET_BY_MODEL[modelKey];
  const fromHeight = bounds.size[1] / 2;
  const fromWidth = bounds.size[0] / Math.sqrt(3);
  return Math.min(fromHeight, fromWidth) * inset;
}

export function ellipseRadiiForModel(
  modelKey: CardModelKey,
): [number, number] {
  const bounds = CARD_MODEL_BOUNDS[modelKey];
  const inset = FACE_INSET_BY_MODEL[modelKey];
  return [(bounds.size[0] / 2) * inset, (bounds.size[1] / 2) * inset];
}

export function triangleSizeForModel(
  modelKey: CardModelKey,
): [number, number] {
  const bounds = CARD_MODEL_BOUNDS[modelKey];
  const inset = FACE_INSET_BY_MODEL[modelKey];
  return [bounds.size[0] * inset, bounds.size[1] * inset];
}

export function faceSizeForModel(modelKey: CardModelKey): [number, number] {
  const bounds = CARD_MODEL_BOUNDS[modelKey];
  const inset = FACE_INSET_BY_MODEL[modelKey];
  const shape = faceShapeForModel(modelKey);

  if (shape === "hexagon") {
    const r = hexRadiusForModel(modelKey);
    return [Math.sqrt(3) * r, 2 * r];
  }
  if (shape === "ellipse") {
    const [rx, ry] = ellipseRadiiForModel(modelKey);
    return [rx * 2, ry * 2];
  }
  if (shape === "triangle") {
    return triangleSizeForModel(modelKey);
  }
  return [bounds.size[0] * inset, bounds.size[1] * inset];
}

export function faceOffsetCenteredForModel(
  modelKey: CardModelKey,
): Vector3Tuple {
  const bounds = CARD_MODEL_BOUNDS[modelKey];
  return [0, 0, bounds.frontZ - bounds.center[2] - FACE_RECESS];
}

export function hitBoxForModel(modelKey: CardModelKey): Vector3Tuple {
  const bounds = CARD_MODEL_BOUNDS[modelKey];
  const pad = 1.06;
  return [bounds.size[0] * pad, bounds.size[1] * pad, bounds.size[2] * pad];
}

export function modelCenterOffsetForModel(
  modelKey: CardModelKey,
): Vector3Tuple {
  const { center } = CARD_MODEL_BOUNDS[modelKey];
  return [-center[0], -center[1], -center[2]];
}

export function modelUrlForModelKey(
  modelKey: CardModelKey,
): keyof typeof MODEL_ASSETS {
  if (modelKey === "glassCardBase") return "glassCardBase";
  if (modelKey === "glassCardRounded") return "glassCardRounded";
  if (modelKey === "skillBadge") return "skillBadge";
  return "contactPortal";
}

export function modelScaleForVariant(
  _variant: ContentCardVariant,
  multiplier = 1,
): number {
  return CARD_MODEL_SCALE * multiplier;
}

/**
 * Pointy-top hex circumradius from model AABB.
 * glass_card_rounded ≈ height 2R, width √3·R.
 */
export function hexRadiusForVariant(variant: ContentCardVariant): number {
  const key = VARIANT_MODEL_KEY[variant];
  const bounds = CARD_MODEL_BOUNDS[key];
  const inset = FACE_INSET_BY_MODEL[key];
  const fromHeight = bounds.size[1] / 2;
  const fromWidth = bounds.size[0] / Math.sqrt(3);
  return Math.min(fromHeight, fromWidth) * inset;
}

/** Ellipse radii [rx, ry] for portal-like openings. */
export function ellipseRadiiForVariant(
  variant: ContentCardVariant,
): [number, number] {
  const key = VARIANT_MODEL_KEY[variant];
  const bounds = CARD_MODEL_BOUNDS[key];
  const inset = FACE_INSET_BY_MODEL[key];
  return [(bounds.size[0] / 2) * inset, (bounds.size[1] / 2) * inset];
}

/** Pointy-top triangle size [width, height] inscribed in the model AABB. */
export function triangleSizeForVariant(
  variant: ContentCardVariant,
): [number, number] {
  const key = VARIANT_MODEL_KEY[variant];
  const bounds = CARD_MODEL_BOUNDS[key];
  const inset = FACE_INSET_BY_MODEL[key];
  return [bounds.size[0] * inset, bounds.size[1] * inset];
}

/** Rounded-rect / shaped face size [width, height] in model-local units. */
export function faceSizeForVariant(
  variant: ContentCardVariant,
): [number, number] {
  const key = VARIANT_MODEL_KEY[variant];
  const bounds = CARD_MODEL_BOUNDS[key];
  const inset = FACE_INSET_BY_MODEL[key];
  const shape = faceShapeForVariant(variant);

  if (shape === "hexagon") {
    const r = hexRadiusForVariant(variant);
    return [Math.sqrt(3) * r, 2 * r];
  }
  if (shape === "ellipse") {
    const [rx, ry] = ellipseRadiiForVariant(variant);
    return [rx * 2, ry * 2];
  }
  if (shape === "triangle") {
    return triangleSizeForVariant(variant);
  }
  return [bounds.size[0] * inset, bounds.size[1] * inset];
}

export function faceOffsetCentered(
  variant: ContentCardVariant,
): Vector3Tuple {
  const bounds = boundsForVariant(variant);
  return [0, 0, bounds.frontZ - bounds.center[2] - FACE_RECESS];
}

export function hitBoxForVariant(
  variant: ContentCardVariant,
): Vector3Tuple {
  const bounds = boundsForVariant(variant);
  const pad = 1.06;
  return [bounds.size[0] * pad, bounds.size[1] * pad, bounds.size[2] * pad];
}

export function modelCenterOffset(
  variant: ContentCardVariant,
): Vector3Tuple {
  const { center } = boundsForVariant(variant);
  return [-center[0], -center[1], -center[2]];
}

export function modelUrlKey(variant: ContentCardVariant): keyof typeof MODEL_ASSETS {
  const key = VARIANT_MODEL_KEY[variant];
  if (key === "glassCardBase") return "glassCardBase";
  if (key === "glassCardRounded") return "glassCardRounded";
  if (key === "skillBadge") return "skillBadge";
  return "contactPortal";
}
