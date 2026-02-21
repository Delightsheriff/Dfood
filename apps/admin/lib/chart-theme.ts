/**
 * Shared Recharts theme constants.
 * Keeps chart styling consistent and DRY across all chart components.
 */

/** Standard tooltip style matching the dark design system */
export const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "8px",
  },
  itemStyle: { color: "#f0ede8" },
  labelStyle: { color: "#999" },
} as const;

/** Default axis props for XAxis / YAxis */
export const CHART_AXIS_PROPS = {
  stroke: "#6b6b6b",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

/** Default CartesianGrid props */
export const CHART_GRID_PROPS = {
  strokeDasharray: "3 3",
  stroke: "#333",
  vertical: false,
} as const;

/** Brand / status palette used across charts */
export const STATUS_COLORS: Record<string, string> = {
  pending: "#eab308",
  confirmed: "#3b82f6",
  preparing: "#a855f7",
  out_for_delivery: "#ff7622",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

/** Brand orange for primary chart accents */
export const BRAND_ORANGE = "#ff7622";
