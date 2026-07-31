import type { TechnologyCategory } from "@shared-types/content";
import type { Vector3Tuple } from "three";
import { CORRIDOR_LAYOUT, laneY } from "@config/corridor";

/**
 * Technology Hive section origin + panel accent colors.
 * Spacing / camera / counts live in techHiveLayout.ts (tunable).
 */
export const TECH_HIVE_CONFIG = {
  /** Upper lane at skills depth — opposite the experience (down) band. */
  origin: [
    0,
    laneY("up"),
    CORRIDOR_LAYOUT.sectionZ.skills,
  ] as Vector3Tuple,
  transitionSeconds: 0.28,
  colors: {
    frontend: "#22D3EE",
    backend: "#8B5CF6",
    database: "#22C55E",
    devops: "#F97316",
    design: "#EC4899",
    ai_ml: "#A78BFA",
  } as Record<TechnologyCategory, string>,
} as const;

export type TechHiveConfig = typeof TECH_HIVE_CONFIG;
