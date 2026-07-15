/** Shared Recharts theme constants. Dark-theme optimized. */

export const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "8px",
  },
  itemStyle: { color: "#f0ede8" },
  labelStyle: { color: "#999" },
} as const;

export const CHART_AXIS_PROPS = {
  stroke: "#6b6b6b",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

export const CHART_GRID_PROPS = {
  strokeDasharray: "3 3",
  stroke: "#333",
  vertical: false,
} as const;

/** Status-based semantic colors (matches status meaning, not just decoration) */
export const STATUS_COLORS: Record<string, string> = {
  pending: "#eab308",
  confirmed: "#3b82f6",
  preparing: "#a855f7",
  out_for_delivery: "#ff7622",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

/** Brand orange for single-series charts and primary accents */
export const BRAND_ORANGE = "#ff7622";

/** Multi-series chart palette — visually distinct on dark backgrounds */
export const CHART_PALETTE = [
  "#ff7622",
  "#3b82f6",
  "#a855f7",
  "#22c55e",
  "#eab308",
  "#06b6d4",
  "#ec4899",
  "#8b5cf6",
];
