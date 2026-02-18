"use client";

import { useDashboardRole } from "./DashboardRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingBag,
  Store,
  Activity,
  LineChart,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsGrid() {
  const { isVendor } = useDashboardRole();

  const adminStats = [
    {
      label: "Total Revenue",
      value: "₦842K",
      change: "↗ 12.5% from last week",
      trend: "up",
      icon: DollarSign,
      color: "text-orange",
      bgColor: "bg-orange/10",
    },
    {
      label: "Orders",
      value: "142",
      change: "↗ 8.2% from last week",
      trend: "up",
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Restaurants",
      value: "48",
      change: "↗ 3 new this week",
      trend: "up",
      icon: Store,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Avg Order Value",
      value: "₦4.8K",
      change: "↘ 2.1% from last week",
      trend: "down",
      icon: Activity,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  const vendorStats = [
    {
      label: "Total Revenue",
      value: "₦124K",
      change: "↗ 12.5% from last week",
      trend: "up",
      icon: DollarSign,
      color: "text-orange",
      bgColor: "bg-orange/10",
    },
    {
      label: "Orders",
      value: "38",
      change: "↗ 8.2% from last week",
      trend: "up",
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Menu Items",
      value: "24",
      change: "↗ 3 new this week",
      trend: "up",
      icon: UtensilsCrossed,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Avg Order Value",
      value: "₦3.2K",
      change: "↘ 2.1% from last week",
      trend: "down",
      icon: LineChart,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  const stats = isVendor ? vendorStats : adminStats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-border bg-surface shadow-sm hover:shadow-md transition-all duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-muted font-mono uppercase tracking-wider">
              {stat.label}
            </CardTitle>
            <div className={cn("rounded-lg p-2", stat.bgColor)}>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text mb-1">
              {stat.value}
            </div>
            <p
              className={cn(
                "text-xs font-semibold flex items-center gap-1",
                stat.trend === "up" ? "text-green-500" : "text-red-500",
              )}
            >
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
