import { COLORS } from "@config/colors";
import type { ContentCardVariant } from "@shared-types/content";
import type { MaterialPresetKey } from "@config/materials";
import type { TextureAssetKey } from "@config/assets";
import { MODEL_ASSETS } from "@config/assets";
import {
  faceOffsetCentered,
  faceSizeForVariant,
  hitBoxForVariant,
  modelScaleForVariant,
  VARIANT_MODEL_KEY,
} from "@config/cardGeometry";
import { CARD_FACE_TYPE_DEFAULTS } from "@config/cardFaceType";

function buildPerVariant<T>(
  factory: (variant: ContentCardVariant) => T,
): Record<ContentCardVariant, T> {
  const variants: ContentCardVariant[] = [
    "hero",
    "project",
    "skill",
    "contact",
    "experience",
    "timeline",
    "certificate",
  ];
  return Object.fromEntries(
    variants.map((variant) => [variant, factory(variant)]),
  ) as Record<ContentCardVariant, T>;
}

export const CARD_CONFIG = {
  hoverScale: 1.03,
  focusScale: 1.04,
  /** Derived from measured GLB bounds + inset. */
  hitBox: buildPerVariant(hitBoxForVariant),
  faceSize: buildPerVariant(faceSizeForVariant),
  /** In centered model space (origin = geometric center). */
  faceOffset: buildPerVariant(faceOffsetCentered),
  faceOpacity: 1,
  /** Overview corridor labels (icon + short text before focus). */
  sectionLabel: {
    hero: "Intro",
    project: "Project",
    skill: "Skill",
    contact: "Contact",
    experience: "Experience",
    timeline: "Timeline",
    certificate: "Certificate",
  } as Record<ContentCardVariant, string>,
  facePattern: {
    hero: "gradientRadial",
    project: "hexPattern",
    skill: "energyPattern",
    contact: "neonEmission",
    experience: "hexPattern",
    timeline: "energyPattern",
    certificate: "gridSubtle",
  } as Record<ContentCardVariant, TextureAssetKey>,
  /** Normalize all cards to the same world height. */
  modelScale: buildPerVariant(modelScaleForVariant),
  /**
   * Canvas face typography (sizes are design units at 2048px texture height).
   * paint* multiplies by height/2048. Live overrides live in cardFaceTypeStore.
   */
  faceType: CARD_FACE_TYPE_DEFAULTS,
  /** Idle bob — kept small; focused / hovered cards freeze float for readable text. */
  floatAmplitude: 0.02,
  floatSpeed: 0.22,
  rotationSpeed: 0,
  colors: {
    hero: COLORS.cyan,
    project: COLORS.electricBlue,
    skill: COLORS.purple,
    contact: COLORS.cyan,
    experience: COLORS.electricBlue,
    timeline: COLORS.purple,
    certificate: COLORS.electricBlue,
  },
  emissive: {
    idle: 0.55,
    hover: 0.95,
    /** Lower than before so glass bloom does not wash face text. */
    focus: 1.15,
  },
  /**
   * Hover / focus visual settle time (scale, emissive, edge fog).
   * Longer = softer pointer response across all cards.
   */
  transitionDuration: 0.75,
} as const;

interface VariantVisual {
  modelUrl: string;
  preset: MaterialPresetKey;
  mapKey?: TextureAssetKey;
}

const MODEL_URL_BY_KEY = {
  glassCardBase: MODEL_ASSETS.glassCardBase,
  glassCardRounded: MODEL_ASSETS.glassCardRounded,
  skillBadge: MODEL_ASSETS.skillBadge,
  contactPortal: MODEL_ASSETS.contactPortal,
} as const;

export const CARD_VARIANT_VISUALS: Record<ContentCardVariant, VariantVisual> = {
  hero: {
    modelUrl: MODEL_URL_BY_KEY[VARIANT_MODEL_KEY.hero],
    preset: "frostedCard",
    mapKey: "glassImperfections",
  },
  project: {
    modelUrl: MODEL_URL_BY_KEY[VARIANT_MODEL_KEY.project],
    preset: "frostedCard",
    mapKey: "glassImperfections",
  },
  skill: {
    modelUrl: MODEL_URL_BY_KEY[VARIANT_MODEL_KEY.skill],
    preset: "neonGlass",
    mapKey: "glassCrystal",
  },
  contact: {
    modelUrl: MODEL_URL_BY_KEY[VARIANT_MODEL_KEY.contact],
    preset: "frostedCard",
    mapKey: "glassImperfections",
  },
  experience: {
    modelUrl: MODEL_URL_BY_KEY[VARIANT_MODEL_KEY.experience],
    preset: "frostedCard",
    mapKey: "glassImperfections",
  },
  timeline: {
    modelUrl: MODEL_URL_BY_KEY[VARIANT_MODEL_KEY.timeline],
    preset: "neonSolid",
  },
  certificate: {
    modelUrl: MODEL_URL_BY_KEY[VARIANT_MODEL_KEY.certificate],
    preset: "frostedCard",
    mapKey: "glassImperfections",
  },
};
