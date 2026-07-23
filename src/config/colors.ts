export const COLORS = {
  black: "#050508",
  darkGray: "#12121A",
  white: "#F5F7FA",
  electricBlue: "#3B82F6",
  purple: "#8B5CF6",
  cyan: "#22D3EE",
} as const;

export type ColorToken = (typeof COLORS)[keyof typeof COLORS];
