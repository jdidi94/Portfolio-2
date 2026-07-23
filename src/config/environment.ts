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
    density: 0.028,
  },
  glow: {
    innerColor: COLORS.electricBlue,
    outerColor: COLORS.purple,
    innerScale: 18,
    outerScale: 32,
    innerOpacity: 0.12,
    outerOpacity: 0.06,
    gradientOpacity: 0.35,
    gridOpacity: 0.08,
    gridScale: 40,
  },
  decor: [
    {
      id: "ring-a",
      kind: "ring",
      position: [-7.5, 1.8, -8],
      scale: 1.15,
      color: COLORS.electricBlue,
      phase: 0.4,
      preset: "neonGlass",
      mapKey: "glassCrystal",
    },
    {
      id: "ring-b",
      kind: "ring",
      position: [8, -1.2, -6],
      scale: 0.95,
      color: COLORS.cyan,
      phase: 1.8,
      preset: "neonGlass",
      mapKey: "glassCrystal",
    },
    {
      id: "wire-a",
      kind: "wire",
      position: [-3, -2.5, -10],
      scale: 0.55,
      color: COLORS.purple,
      phase: 2.6,
      preset: "neonWire",
    },
    {
      id: "wire-b",
      kind: "wire",
      position: [2.5, 3.2, -9],
      scale: 0.45,
      color: COLORS.electricBlue,
      phase: 3.4,
      preset: "neonWire",
    },
    {
      id: "sphere-a",
      kind: "sphere",
      position: [5.5, 2.4, -11],
      scale: 0.5,
      color: COLORS.cyan,
      phase: 1.1,
      preset: "neonSolid",
      mapKey: "glassCrystal",
    },
    {
      id: "pillar-a",
      kind: "pillar",
      position: [-10, -1.5, -12],
      scale: 0.7,
      color: COLORS.electricBlue,
      phase: 0.9,
      preset: "neonSolid",
      mapKey: "metalBrushed",
    },
    {
      id: "pillar-b",
      kind: "pillar",
      position: [10.5, -1.8, -13],
      scale: 0.6,
      color: COLORS.purple,
      phase: 2.2,
      preset: "neonSolid",
      mapKey: "metalBrushed",
    },
    {
      id: "platform-a",
      kind: "platform",
      position: [0, -3.2, -7],
      scale: 1.4,
      color: COLORS.electricBlue,
      phase: 0.2,
      preset: "metalAccent",
      mapKey: "metalBrushed",
      rotation: [-Math.PI / 2, 0, 0],
    },
    {
      id: "card-a",
      kind: "card",
      position: [-5, 0.6, -14],
      scale: 0.85,
      color: COLORS.cyan,
      phase: 1.5,
      preset: "frostedCard",
      mapKey: "glassCrystal",
    },
    {
      id: "card-b",
      kind: "cardRounded",
      position: [5.2, 0.2, -15],
      scale: 0.75,
      color: COLORS.purple,
      phase: 2.8,
      preset: "frostedCard",
      mapKey: "glassCrystal",
    },
    {
      id: "badge-a",
      kind: "badge",
      position: [-1.5, 2.8, -12],
      scale: 0.4,
      color: COLORS.electricBlue,
      phase: 3.1,
      preset: "neonGlass",
    },
    {
      id: "portal-a",
      kind: "portal",
      position: [0, 0.5, -18],
      scale: 0.9,
      color: COLORS.cyan,
      phase: 0.7,
      preset: "neonGlass",
      mapKey: "glassCrystal",
    },
  ] satisfies readonly DecorItemConfig[],
  emissiveMarkers: [
    {
      id: "marker-blue",
      position: [-6, -1.5, -4] as [number, number, number],
      radius: 0.08,
      color: COLORS.electricBlue,
      intensity: 2.5,
    },
    {
      id: "marker-purple",
      position: [6.5, 2, -5] as [number, number, number],
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
