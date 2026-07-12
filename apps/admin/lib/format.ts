/**
 * Shared formatting utilities — single source of truth.
 * Replaces the duplicate helpers previously scattered across
 * StatsGrid, OrderStatsCards, ActivityFeed, and analytics page.
 */

// ── Currency ──────────────────────────────────────────────────────────────────

/**
 * Format a number as Nigerian Naira.
 * - Compact: ₦1.2M / ₦45K for large values
 * - Full:    ₦12,500 for small values
 */
export function formatCurrency(
  amount: number,
  opts: { compact?: boolean } = { compact: true },
): string {
  if (!amount || Number.isNaN(amount)) return "₦0";

  if (opts.compact) {
    if (amount >= 1_000_000)
      return `₦${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    if (amount >= 1_000)
      return `₦${(amount / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Dates ─────────────────────────────────────────────────────────────────────

/** "Feb 14" style — for chart axis labels */
export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** "Feb 14, 2026" style — for tables / detail views */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Relative time: "just now", "5m ago", "2h ago", "3d ago" */
export function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Strings ───────────────────────────────────────────────────────────────────

/** "out_for_delivery" → "Out For Delivery" */
export function formatStatusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Extract initials from a name: "John Doe" → "JD" */
export function getInitials(name?: string): string {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"
  );
}
