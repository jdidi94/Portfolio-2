import type { Technology } from "@shared-types/content";
import type { CardModelKey } from "@config/cardGeometry";
import {
  TECH_HIVE_LEGEND_ITEMS,
  type TechHiveLegendGroup,
} from "@config/techHiveLegend";

/**
 * Visual identity per Technology Hive legend group.
 * Shape stays hexagon-only for honeycomb consistency.
 * Color differentiates category; model stays on hex GLBs only.
 */
export interface TechHiveGroupVisual {
  group: TechHiveLegendGroup;
  label: string;
  color: string;
  /** Hex-opening models only (`skillBadge` / `glassCardRounded`). */
  modelKey: Extract<CardModelKey, "skillBadge" | "glassCardRounded">;
}

const LEGEND_LABEL: Readonly<Record<TechHiveLegendGroup, string>> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  design: "Design",
  ai_ml: "AI / ML",
};

const LEGEND_COLOR: Readonly<Record<TechHiveLegendGroup, string>> =
  Object.fromEntries(
    TECH_HIVE_LEGEND_ITEMS.map((item) => [item.id, item.dotColor]),
  ) as Record<TechHiveLegendGroup, string>;

/** Cluster / visual order — matches bottom legend left→right. */
export const TECH_HIVE_GROUP_ORDER: readonly TechHiveLegendGroup[] = [
  "frontend",
  "backend",
  "database",
  "devops",
  "design",
  "ai_ml",
] as const;

/** All groups use hex badge frames — category is told by border color. */
export const TECH_HIVE_VISUAL_BY_GROUP: Readonly<
  Record<TechHiveLegendGroup, TechHiveGroupVisual>
> = {
  frontend: {
    group: "frontend",
    label: LEGEND_LABEL.frontend,
    color: LEGEND_COLOR.frontend,
    modelKey: "skillBadge",
  },
  backend: {
    group: "backend",
    label: LEGEND_LABEL.backend,
    color: LEGEND_COLOR.backend,
    modelKey: "skillBadge",
  },
  database: {
    group: "database",
    label: LEGEND_LABEL.database,
    color: LEGEND_COLOR.database,
    modelKey: "skillBadge",
  },
  devops: {
    group: "devops",
    label: LEGEND_LABEL.devops,
    color: LEGEND_COLOR.devops,
    modelKey: "skillBadge",
  },
  design: {
    group: "design",
    label: LEGEND_LABEL.design,
    color: LEGEND_COLOR.design,
    modelKey: "skillBadge",
  },
  ai_ml: {
    group: "ai_ml",
    label: LEGEND_LABEL.ai_ml,
    color: LEGEND_COLOR.ai_ml,
    modelKey: "skillBadge",
  },
};

export function resolveTechHiveVisual(
  tech: Pick<Technology, "category">,
): TechHiveGroupVisual {
  return TECH_HIVE_VISUAL_BY_GROUP[tech.category];
}

export function techHiveGroupSortIndex(group: TechHiveLegendGroup): number {
  const index = TECH_HIVE_GROUP_ORDER.indexOf(group);
  return index >= 0 ? index : TECH_HIVE_GROUP_ORDER.length;
}

/** Stable sort: legend group clusters first, then original array order. */
export function sortTechnologiesForHiveCluster<T extends Technology>(
  techs: readonly T[],
): T[] {
  return [...techs].sort((a, b) => {
    const groupDelta =
      techHiveGroupSortIndex(a.category) - techHiveGroupSortIndex(b.category);
    if (groupDelta !== 0) return groupDelta;
    return 0;
  });
}
