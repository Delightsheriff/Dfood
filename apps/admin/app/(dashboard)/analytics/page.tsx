"use client";

import { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";
import { useAnalytics, isAdminAnalytics } from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
  PieChart,
  Pie,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  TrendingUp,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminAnalytics } from "@/services/analytics.service";

// ── Helpers ───────────────────────────────────────────────────────────────────

const DAY_OPTIONS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

function formatCurrency(amount: number): string {
  if (!amount || Number.isNaN(amount)) return "₦0";
  if (amount >= 1_000_000)
    return `₦${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (amount >= 1_000)
    return `₦${(amount / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `₦${amount.toLocaleString()}`;
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatStatusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#eab308",
  confirmed: "#3b82f6",
  preparing: "#a855f7",
  out_for_delivery: "#ff7622",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

function ChangeIndicator({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  if (value === 0)
    return (
      <span className="inline-flex items-center text-xs text-text-muted">
        <Minus className="h-3 w-3 mr-0.5" /> 0%{suffix}
      </span>
    );
  const isUp = value > 0;
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-semibold",
        isUp ? "text-green-500" : "text-red-500",
      )}
    >
      <Icon className="h-3 w-3 mr-0.5" />
      {Math.abs(value).toFixed(1)}%{suffix}
    </span>
  );
}

// ── Summary Cards ─────────────────────────────────────────────────────────────

function SummaryCards({
  analytics,
  isVendor,
  isLoading,
}: {
  analytics: ReturnType<typeof useAnalytics>["data"];
  isVendor: boolean;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border bg-surface">
            <CardContent className="p-5">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-7 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const { summary } = analytics;

  type CardDef = {
    label: string;
    value: string;
    change: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  };

  const cards: CardDef[] = [
    {
      label: "Total Revenue",
      value: formatCurrency(summary.totalRevenue),
      change: summary.revenueChange,
      icon: DollarSign,
      color: "text-orange",
      bgColor: "bg-orange/10",
    },
    {
      label: "Total Orders",
      value: summary.totalOrders.toLocaleString(),
      change: summary.ordersChange,
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Avg Order Value",
      value: formatCurrency(summary.averageOrderValue),
      change: 0,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  if (!isVendor && isAdminAnalytics(analytics)) {
    cards.push({
      label: "Total Users",
      value: analytics.summary.totalUsers.toLocaleString(),
      change: analytics.summary.usersChange,
      icon: Users,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    });
    cards.splice(3, 0, {
      label: "Active Restaurants",
      value: analytics.summary.activeRestaurants.toLocaleString(),
      change: 0,
      icon: Store,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    });
  }

  const gridCols =
    cards.length <= 4
      ? "grid-cols-2 lg:grid-cols-4"
      : "grid-cols-2 lg:grid-cols-5";

  return (
    <div className={cn("grid gap-4", gridCols)}>
      {cards.map((card) => (
        <Card
          key={card.label}
          className="border-border bg-surface hover:shadow-md transition-all duration-200"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                {card.label}
              </span>
              <div className={cn("rounded-lg p-2", card.bgColor)}>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
            </div>
            <div className="text-2xl font-bold text-text truncate">
              {card.value}
            </div>
            <div className="mt-1">
              <ChangeIndicator value={card.change} suffix=" vs prior period" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Orders Trend Chart ────────────────────────────────────────────────────────

function OrdersTrendChart({
  data,
  isLoading,
}: {
  data?: { date: string; orders: number }[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="border-border bg-surface">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-62.5" />
        </CardContent>
      </Card>
    );
  }

  const chartData =
    data?.map((p) => ({ name: formatShortDate(p.date), orders: p.orders })) ??
    [];

  return (
    <Card className="border-border bg-surface">
      <CardHeader>
        <CardTitle className="text-base font-bold text-text">
          Orders Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-62.5 text-text-muted text-sm">
            No order data available
          </div>
        ) : (
          <div className="h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#6b6b6b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b6b6b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                  vertical={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#f0ede8" }}
                  labelStyle={{ color: "#999" }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Status Breakdown Donut ────────────────────────────────────────────────────

function StatusBreakdown({
  data,
  isLoading,
}: {
  data?: { status: string; count: number }[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="border-border bg-surface">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-62.5 w-full" />
        </CardContent>
      </Card>
    );
  }

  const total = data?.reduce((sum, d) => sum + d.count, 0) ?? 0;
  const chartData =
    data?.map((d) => ({
      name: formatStatusLabel(d.status),
      value: d.count,
      fill: STATUS_COLORS[d.status] ?? "#6b6b6b",
    })) ?? [];

  return (
    <Card className="border-border bg-surface">
      <CardHeader>
        <CardTitle className="text-base font-bold text-text">
          Order Status Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-62.5 text-text-muted text-sm">
            No data
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="h-50 w-50 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#f0ede8" }}
                    formatter={(value: number) => [
                      `${value} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
                      "",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm text-text">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-text">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Popular Items (Vendor) ────────────────────────────────────────────────────

function PopularItems({
  items,
  isLoading,
}: {
  items?: { name: string; orders: number; revenue: number }[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="border-border bg-surface">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!items || items.length === 0) return null;

  const maxOrders = Math.max(...items.map((i) => i.orders));

  return (
    <Card className="border-border bg-surface">
      <CardHeader>
        <CardTitle className="text-base font-bold text-text">
          Popular Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text truncate max-w-[60%]">
                  {item.name}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <Badge
                    variant="secondary"
                    className="bg-blue-500/10 text-blue-500 border-0"
                  >
                    {item.orders} orders
                  </Badge>
                  <span className="text-text-muted font-mono">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange transition-all duration-500"
                  style={{
                    width: `${(item.orders / maxOrders) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Top Restaurants (Admin) ───────────────────────────────────────────────────

function TopRestaurants({
  analytics,
  isLoading,
}: {
  analytics?: AdminAnalytics;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="border-border bg-surface">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-62.5 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!analytics?.topRestaurants?.length) return null;

  const data = analytics.topRestaurants.slice(0, 6).map((r) => ({
    name:
      r.restaurantName.length > 14
        ? r.restaurantName.slice(0, 14) + "…"
        : r.restaurantName,
    revenue: r.revenue,
    orders: r.orderCount,
  }));

  return (
    <Card className="border-border bg-surface">
      <CardHeader>
        <CardTitle className="text-base font-bold text-text">
          Top Restaurants by Revenue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-62.5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <XAxis
                type="number"
                stroke="#6b6b6b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatCurrency(v)}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#6b6b6b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                horizontal={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#f0ede8" }}
                labelStyle={{ color: "#999" }}
                formatter={(value: number) => [
                  formatCurrency(value),
                  "Revenue",
                ]}
              />
              <Bar
                dataKey="revenue"
                fill="#ff7622"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Category Performance (Admin) ──────────────────────────────────────────────

function CategoryPerformance({
  analytics,
  isLoading,
}: {
  analytics?: AdminAnalytics;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="border-border bg-surface">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-62.5 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!analytics?.categoryPerformance?.length) return null;

  const data = analytics.categoryPerformance.slice(0, 6).map((c) => ({
    name:
      c.categoryName.length > 16
        ? c.categoryName.slice(0, 16) + "…"
        : c.categoryName,
    revenue: c.revenue,
    orders: c.orderCount,
  }));

  return (
    <Card className="border-border bg-surface">
      <CardHeader>
        <CardTitle className="text-base font-bold text-text">
          Category Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-62.5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#6b6b6b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b6b6b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatCurrency(v)}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#f0ede8" }}
                labelStyle={{ color: "#999" }}
                formatter={(value: number, name: string) => [
                  name === "revenue"
                    ? formatCurrency(value)
                    : value.toLocaleString(),
                  name === "revenue" ? "Revenue" : "Orders",
                ]}
              />
              <Bar dataKey="revenue" fill="#ff7622" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ── User Growth (Admin) ───────────────────────────────────────────────────────

function UserGrowthChart({
  analytics,
  isLoading,
}: {
  analytics?: AdminAnalytics;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="border-border bg-surface">
        <CardHeader>
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-62.5 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!analytics?.userGrowth?.length) return null;

  const data = analytics.userGrowth.map((p) => ({
    name: formatShortDate(p.date),
    customers: p.customers,
    vendors: p.vendors,
  }));

  return (
    <Card className="border-border bg-surface">
      <CardHeader>
        <CardTitle className="text-base font-bold text-text">
          User Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-62.5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVendors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="#6b6b6b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b6b6b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#f0ede8" }}
                labelStyle={{ color: "#999" }}
              />
              <Area
                type="monotone"
                dataKey="customers"
                stroke="#22c55e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCustomers)"
              />
              <Area
                type="monotone"
                dataKey="vendors"
                stroke="#a855f7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVendors)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-xs text-text-muted">Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500" />
            <span className="text-xs text-text-muted">Vendors</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { isVendor } = useDashboardRole();
  const [days, setDays] = useState("7");
  const { data: analytics, isLoading } = useAnalytics({
    isVendor,
    params: { days: Number(days) },
  });

  const revenueData = analytics?.revenueTrend?.map((p) => ({
    name: formatShortDate(p.date),
    total: p.revenue,
  }));

  const admin =
    analytics && isAdminAnalytics(analytics) ? analytics : undefined;

  return (
    <PageShell
      title="Analytics"
      action={
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="w-40 bg-surface border-border text-text">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {/* Summary cards */}
      <SummaryCards
        analytics={analytics}
        isVendor={isVendor}
        isLoading={isLoading}
      />

      {/* Revenue + Orders trend */}
      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart
          title={isVendor ? "Sales Trend" : "Revenue Trend"}
          data={revenueData}
          isLoading={isLoading}
          className="col-span-1! !md:col-span-1"
          height={250}
        />
        <OrdersTrendChart data={analytics?.orderTrend} isLoading={isLoading} />
      </div>

      {/* Status breakdown + Popular items / Top restaurants */}
      <div className="grid gap-6 md:grid-cols-2">
        <StatusBreakdown
          data={analytics?.statusBreakdown}
          isLoading={isLoading}
        />
        {isVendor ? (
          <PopularItems
            items={
              analytics && !isAdminAnalytics(analytics)
                ? analytics.popularItems
                : undefined
            }
            isLoading={isLoading}
          />
        ) : (
          <TopRestaurants analytics={admin} isLoading={isLoading} />
        )}
      </div>

      {/* Admin‑only: Category performance + User growth */}
      {!isVendor && (
        <div className="grid gap-6 md:grid-cols-2">
          <CategoryPerformance analytics={admin} isLoading={isLoading} />
          <UserGrowthChart analytics={admin} isLoading={isLoading} />
        </div>
      )}
    </PageShell>
  );
}
