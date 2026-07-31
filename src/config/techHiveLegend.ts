/**
 * Technology Hive legend (visual-only UI).
 * These legend groups are aligned to the provided screenshot layout.
 */

export type TechHiveLegendGroup =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "design"
  | "ai_ml";

export interface TechHiveLegendItem {
  id: TechHiveLegendGroup;
  label: string;
  dotColor: string;
}

export const TECH_HIVE_LEGEND_ITEMS: readonly TechHiveLegendItem[] = [
  { id: "frontend", label: "Frontend", dotColor: "#22D3EE" },
  { id: "backend", label: "Backend", dotColor: "#8B5CF6" },
  { id: "database", label: "Database", dotColor: "#22C55E" },
  { id: "devops", label: "DevOps", dotColor: "#F97316" },
  { id: "design", label: "Design", dotColor: "#EC4899" },
  { id: "ai_ml", label: "AI / ML", dotColor: "#A78BFA" },
] as const;

