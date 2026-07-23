import { COLORS } from "@config/colors";

export const LIGHTING_CONFIG = {
  ambient: {
    intensity: 0.22,
    color: COLORS.white,
  },
  directional: {
    intensity: 0.55,
    color: COLORS.white,
    position: [4, 8, 6] as [number, number, number],
  },
  accents: [
    {
      id: "blue",
      color: COLORS.electricBlue,
      intensity: 1.4,
      distance: 18,
      position: [-5, 2, -2] as [number, number, number],
    },
    {
      id: "cyan",
      color: COLORS.cyan,
      intensity: 1.1,
      distance: 16,
      position: [5, 1.5, 3] as [number, number, number],
    },
    {
      id: "purple",
      color: COLORS.purple,
      intensity: 0.9,
      distance: 20,
      position: [0, -2, -6] as [number, number, number],
    },
  ],
} as const;
