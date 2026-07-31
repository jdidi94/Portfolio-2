import { COLORS } from "@config/colors";
import { MODEL_ASSETS } from "@config/assets";
import type { MaterialPresetKey } from "@config/materials";
import type { TextureAssetKey } from "@config/assets";

export type DecorKind =
  | "ring"
  | "wire"
  | "sphere"
  | "pillar"
  | "platform"
  | "card"
  | "cardRounded"
  | "badge"
  | "portal";

export interface DecorItemConfig {
  id: string;
  kind: DecorKind;
  position: [number, number, number];
  scale: number;
  color: string;
  phase: number;
  rotation?: [number, number, number];
  preset?: MaterialPresetKey;
  mapKey?: TextureAssetKey;
}

export const ENVIRONMENT_CONFIG = {
  fog: {
    color: COLORS.black,
    /** Lighter fog so deep corridor bands stay visible. */
    density: 0.018,
  },
  glow: {
    innerColor: COLORS.electricBlue,
    outerColor: COLORS.purple,
    innerScale: 22,
    outerScale: 48,
    innerOpacity: 0.12,
    outerOpacity: 0.055,
    gradientOpacity: 0.35,
    gridOpacity: 0.08,
    gridScale: 55,
  },
  decor: [
    {
      id: "ring-a",
      kind: "ring",
      position: [-8, 3.2, -12],
      scale: 1.15,
      color: COLORS.electricBlue,
      phase: 0.4,
      preset: "neonGlass",
      mapKey: "glassCrystal",
    },
    {
      id: "ring-b",
      kind: "ring",
      position: [8.5, -2.4, -10],
      scale: 0.95,
      color: COLORS.cyan,
      phase: 1.8,
      preset: "neonGlass",
      mapKey: "glassCrystal",
    },
    {
      id: "wire-a",
      kind: "wire",
      position: [-4, -3.2, -22],
      scale: 0.55,
      color: COLORS.purple,
      phase: 2.6,
      preset: "neonWire",
    },
    {
      id: "wire-b",
      kind: "wire",
      position: [3.5, 4.2, -28],
      scale: 0.45,
      color: COLORS.electricBlue,
      phase: 3.4,
      preset: "neonWire",
    },
    {
      id: "sphere-a",
      kind: "sphere",
      position: [6.5, 3.4, -36],
      scale: 0.5,
      color: COLORS.cyan,
      phase: 1.1,
      preset: "neonSolid",
      mapKey: "glassCrystal",
    },
    {
      id: "pillar-a",
      kind: "pillar",
      position: [-11, -2.8, -40],
      scale: 0.7,
      color: COLORS.electricBlue,
      phase: 0.9,
      preset: "neonSolid",
      mapKey: "metalBrushed",
    },
    {
      id: "pillar-b",
      kind: "pillar",
      position: [11, 2.8, -48],
      scale: 0.6,
      color: COLORS.purple,
      phase: 2.2,
      preset: "neonSolid",
      mapKey: "metalBrushed",
    },
    {
      id: "platform-a",
      kind: "platform",
      position: [0, -3.8, -8],
      scale: 1.4,
      color: COLORS.electricBlue,
      phase: 0.2,
      preset: "metalAccent",
      mapKey: "metalBrushed",
      rotation: [-Math.PI / 2, 0, 0],
    },
    // Contact landmark — aligned with contact band
    {
      id: "portal-contact",
      kind: "portal",
      position: [0, -0.4, -95],
      scale: 1.15,
      color: COLORS.cyan,
      phase: 0.6,
      preset: "neonGlass",
      mapKey: "glassCrystal",
    },
    {
      id: "platform-contact",
      kind: "platform",
      position: [0, -3.6, -92],
      scale: 1.2,
      color: COLORS.purple,
      phase: 1.4,
      preset: "metalAccent",
      mapKey: "metalBrushed",
      rotation: [-Math.PI / 2, 0, 0],
    },
  ] satisfies readonly DecorItemConfig[],
  emissiveMarkers: [
    {
      id: "marker-blue",
      position: [-6, -1.8, -6] as [number, number, number],
      radius: 0.08,
      color: COLORS.electricBlue,
      intensity: 2.5,
    },
    {
      id: "marker-purple",
      position: [6.5, 2.6, -14] as [number, number, number],
      radius: 0.06,
      color: COLORS.purple,
      intensity: 2.2,
    },
  ],
} as const;

export const DECOR_MODEL_URL: Record<DecorKind, string> = {
  ring: MODEL_ASSETS.floatingRing,
  wire: MODEL_ASSETS.wireframeObject,
  sphere: MODEL_ASSETS.floatingSphere,
  pillar: MODEL_ASSETS.neonPillar,
  platform: MODEL_ASSETS.hologramPlatform,
  card: MODEL_ASSETS.glassCardBase,
  cardRounded: MODEL_ASSETS.glassCardRounded,
  badge: MODEL_ASSETS.skillBadge,
  portal: MODEL_ASSETS.contactPortal,
};
