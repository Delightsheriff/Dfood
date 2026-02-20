"use client";

import { useDashboardRole } from "./DashboardRoleContext";
import { useOrders } from "@/hooks/useOrders";
import { Order, OrderCustomer } from "@/services/orders.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  XCircle,
  ChefHat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const STATUS_META: Record<
  Order["status"],
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
  }
> = {
  pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  confirmed: { icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
  preparing: {
    icon: ChefHat,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  out_for_delivery: { icon: Truck, color: "text-orange", bg: "bg-orange/10" },
  delivered: {
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

function formatCurrency(amount: number): string {
  if (!amount || Number.isNaN(amount)) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function timeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getCustomerName(customerId: string | OrderCustomer): string {
  if (typeof customerId === "string") return "Customer";
  return customerId.name || "Customer";
}

function formatStatus(status: Order["status"]): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ActivityFeed() {
  const { isVendor } = useDashboardRole();
  const { data: orders, isLoading } = useOrders({ isVendor });

  // Take only the 5 most recent orders
  const recentOrders = [...(orders ?? [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  if (isLoading) {
    return (
      <Card className="col-span-4 border-border bg-surface md:col-span-1">
        <CardHeader>
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4 border-border bg-surface md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-text">
          Recent Orders
        </CardTitle>
        <Link
          href="/orders"
          className="flex items-center text-xs font-semibold text-orange hover:opacity-80 transition-opacity"
        >
          View All <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-text-muted py-8 text-center">
            No orders yet
          </p>
        ) : (
          <div className="space-y-5">
            {recentOrders.map((order) => {
              const meta = STATUS_META[order.status];
              const Icon = meta.icon;
              return (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="flex gap-3 group"
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/50",
                      meta.bg,
                    )}
                  >
                    <Icon className={cn("h-4 w-4", meta.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text leading-snug truncate group-hover:text-orange transition-colors">
                      <span className="font-semibold">
                        #{order.orderNumber}
                      </span>{" "}
                      · {getCustomerName(order.customerId)}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn("text-xs font-medium", meta.color)}>
                        {formatStatus(order.status)}
                      </span>
                      <span className="text-text-dim text-xs">·</span>
                      <span className="text-xs text-text-muted font-mono">
                        {formatCurrency(order.total)}
                      </span>
                      <span className="text-text-dim text-xs">·</span>
                      <span className="text-xs text-text-muted font-mono">
                        {timeAgo(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
