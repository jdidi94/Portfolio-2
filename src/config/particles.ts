import { COLORS } from "@config/colors";

export const PARTICLES_CONFIG = {
  count: 360,
  spreadX: 28,
  spreadY: 16,
  spreadZ: 28,
  size: 0.18,
  opacity: 0.55,
  color: COLORS.cyan,
  rotationYSpeed: 0.02,
  rotationXSpeed: 0.008,
  reducedMotionCount: 80,
} as const;
