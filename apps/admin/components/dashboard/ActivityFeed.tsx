"use client";

import { useDashboardRole } from "./DashboardRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  CreditCard,
  UserPlus,
  FileText,
  Package,
  Star,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function ActivityFeed() {
  const { isVendor } = useDashboardRole();

  const adminActivity = [
    {
      text: "New restaurant Mama Cass Kitchen approved",
      time: "2 minutes ago",
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10",
      highlight: "Mama Cass Kitchen",
    },
    {
      text: "Payment of ₦42,500 processed",
      time: "15 minutes ago",
      icon: CreditCard,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      highlight: "₦42,500",
    },
    {
      text: "3 new users registered",
      time: "1 hour ago",
      icon: UserPlus,
      color: "text-orange",
      bg: "bg-orange/10",
      highlight: "3 new users",
    },
    {
      text: "Weekly report generated",
      time: "3 hours ago",
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      highlight: "report",
    },
  ];

  const vendorActivity = [
    {
      text: "Order #ORD-2401 delivered",
      time: "5 minutes ago",
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10",
      highlight: "#ORD-2401",
    },
    {
      text: "2 new orders received",
      time: "12 minutes ago",
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      highlight: "2 new orders",
    },
    {
      text: "Menu item Jollof Rice updated",
      time: "1 hour ago",
      icon: Utensils,
      color: "text-orange",
      bg: "bg-orange/10",
      highlight: "Jollof Rice",
    },
    {
      text: "New review: 5 stars",
      time: "2 hours ago",
      icon: Star,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      highlight: "5 stars",
    },
  ];

  const activities = isVendor ? vendorActivity : adminActivity;

  return (
    <Card className="col-span-4 border-border bg-surface md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-text">
          Recent Activity
        </CardTitle>
        <button className="flex items-center text-xs font-semibold text-orange hover:opacity-80 transition-opacity">
          View All <ArrowRight className="ml-1 h-3 w-3" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/50",
                  item.bg,
                )}
              >
                <item.icon className={cn("h-4 w-4", item.color)} />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-text leading-snug">
                  {item.text.split(item.highlight).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="font-semibold text-text">
                          {item.highlight}
                        </span>
                      )}
                    </span>
                  ))}
                  {/* Fallback if split doesn't work as expected for simple bolding, but logic above covers basic case */}
                </p>
                <p className="text-xs font-mono text-text-muted">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
