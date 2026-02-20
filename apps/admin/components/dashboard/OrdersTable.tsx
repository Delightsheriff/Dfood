"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardRole } from "./DashboardRoleContext";
import { useOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { Order } from "@/services/orders.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Loader2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Preparing", value: "preparing" },
  { label: "Out for Delivery", value: "out_for_delivery" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
] as const;

export function OrdersTable() {
  const router = useRouter();
  const { isVendor } = useDashboardRole();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const {
    data: orders,
    isLoading,
    isError,
  } = useOrders({
    isVendor,
    filters:
      statusFilter !== "all"
        ? { status: statusFilter as Order["status"] }
        : undefined,
  });
  const updateStatus = useUpdateOrderStatus({ isVendor });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const sortedOrders = [...(orders ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleStatusChange = async (
    orderId: string,
    status: Order["status"],
  ) => {
    setUpdatingId(orderId);
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Card className="border-border bg-surface overflow-hidden">
      {/* Status Filter Tabs */}
      <div className="border-b border-border/60 px-4 pt-4 pb-0 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "relative px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap",
                statusFilter === tab.value
                  ? "text-orange"
                  : "text-text-muted hover:text-text hover:bg-surface-2/50",
              )}
            >
              {tab.label}
              {statusFilter === tab.value && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <CardContent className="p-0">
        {/* Loading */}
        {isLoading && (
          <div className="p-4">
            <OrdersTableSkeleton isVendor={isVendor} />
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-red-500/10 p-3 mb-3">
              <Package className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-sm font-medium text-text mb-1">
              Failed to load orders
            </p>
            <p className="text-xs text-text-muted">
              Please check your connection and try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && sortedOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-surface-2 p-3 mb-3">
              <Package className="h-6 w-6 text-text-muted" />
            </div>
            <p className="text-sm font-medium text-text mb-1">
              No orders found
            </p>
            <p className="text-xs text-text-muted">
              {statusFilter !== "all"
                ? `No ${statusFilter.replace(/_/g, " ")} orders right now.`
                : "Orders will appear here once placed."}
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && sortedOrders.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TH>Order</TH>
                  <TH>Customer</TH>
                  {!isVendor && <TH>Restaurant</TH>}
                  <TH>Items</TH>
                  <TH>Total</TH>
                  <TH>Payment</TH>
                  <TH>Status</TH>
                  <TH>Time</TH>
                  <TH className="text-right pr-4">Action</TH>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order) => {
                  const customerName = getCustomerName(order);
                  const restaurantName = getRestaurantName(order);
                  const statusLabel = formatStatusLabel(order.status);
                  const allowedStatuses = getAllowedStatuses(order.status);
                  const isUpdating = updatingId === order._id;
                  const itemCount =
                    order.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

                  return (
                    <TableRow
                      key={order._id}
                      className="border-border/30 hover:bg-surface-2/50 transition-colors group"
                    >
                      {/* Order Number */}
                      <TableCell className="pl-4">
                        <span className="font-mono text-sm font-semibold text-orange">
                          {formatOrderNumber(order.orderNumber)}
                        </span>
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 bg-linear-to-br from-orange/80 to-orange-dim/80">
                            <AvatarFallback className="bg-transparent text-white text-[11px] font-bold">
                              {getInitials(customerName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-text truncate max-w-32">
                            {customerName}
                          </span>
                        </div>
                      </TableCell>

                      {/* Restaurant (admin only) */}
                      {!isVendor && (
                        <TableCell className="text-sm text-text-dim truncate max-w-40">
                          {restaurantName}
                        </TableCell>
                      )}

                      {/* Items count */}
                      <TableCell>
                        <span className="text-sm text-text-muted tabular-nums">
                          {itemCount}
                        </span>
                      </TableCell>

                      {/* Total */}
                      <TableCell>
                        <span className="font-mono text-sm font-semibold text-text tabular-nums">
                          {formatCurrency(order.total)}
                        </span>
                      </TableCell>

                      {/* Payment */}
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] rounded-full px-2 py-0.5 border-0 w-fit",
                              getPaymentStatusColor(order.paymentStatus),
                            )}
                          >
                            {capitalise(order.paymentStatus)}
                          </Badge>
                          <span className="text-[10px] text-text-muted uppercase">
                            {order.paymentMethod}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "font-medium text-xs rounded-full px-3 py-1 border-0",
                            getStatusColor(order.status),
                          )}
                        >
                          <span
                            className={cn(
                              "mr-1.5 h-1.5 w-1.5 rounded-full inline-block",
                              getStatusDotColor(order.status),
                            )}
                          />
                          {statusLabel}
                        </Badge>
                      </TableCell>

                      {/* Time */}
                      <TableCell>
                        <span className="text-xs text-text-muted font-mono whitespace-nowrap">
                          {formatRelativeTime(order.createdAt)}
                        </span>
                      </TableCell>

                      {/* Action column */}
                      <TableCell className="pr-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Vendor status update */}
                          {isVendor && allowedStatuses.length > 0 && (
                            <Select
                              onValueChange={(value) =>
                                handleStatusChange(
                                  order._id,
                                  value as Order["status"],
                                )
                              }
                              disabled={isUpdating}
                            >
                              <SelectTrigger className="h-8 text-xs bg-surface-2 border-border/60 w-36">
                                {isUpdating ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <SelectValue placeholder="Move to..." />
                                )}
                              </SelectTrigger>
                              <SelectContent>
                                {allowedStatuses.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {formatStatusLabel(s)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {/* View details button */}
                          <button
                            onClick={() => router.push(`/orders/${order._id}`)}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border/60 bg-surface-2 hover:bg-surface-2/80 text-text-muted hover:text-text transition-colors"
                            title="View order details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Footer */}
        {!isLoading && !isError && sortedOrders.length > 0 && (
          <div className="flex items-center justify-between border-t border-border/40 px-4 py-3">
            <span className="text-xs text-text-muted">
              Showing {sortedOrders.length} order
              {sortedOrders.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Reusable table header cell ───────────────────────────────────── */

function TH({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TableHead
      className={cn(
        "text-[11px] uppercase tracking-widest text-text-muted font-semibold first:pl-4",
        className,
      )}
    >
      {children}
    </TableHead>
  );
}

/* ─── Helpers ──────────────────────────────────────────────────────── */

function getCustomerName(order: {
  customerId?: { name?: string; _id?: string } | string;
}): string {
  if (!order.customerId || typeof order.customerId === "string")
    return "Customer";
  return order.customerId.name?.trim() || "Customer";
}

function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "C";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function getRestaurantName(order: {
  restaurantId?: { name?: string } | string;
}): string {
  if (!order.restaurantId || typeof order.restaurantId === "string")
    return "Unknown";
  return order.restaurantId.name || "Unknown";
}

function formatOrderNumber(orderNumber: string): string {
  if (!orderNumber) return "#";
  return orderNumber.startsWith("#") ? orderNumber : `#${orderNumber}`;
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function normalizeStatus(status: string): string {
  return status.replace(/_/g, " ").toLowerCase();
}

function formatStatusLabel(status: string): string {
  return normalizeStatus(status)
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function getStatusColor(status: string): string {
  switch (normalizeStatus(status)) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-500";
    case "confirmed":
      return "bg-blue-500/10 text-blue-500";
    case "preparing":
      return "bg-indigo-500/10 text-indigo-500";
    case "out for delivery":
      return "bg-purple-500/10 text-purple-500";
    case "delivered":
      return "bg-green-500/10 text-green-500";
    case "cancelled":
      return "bg-red-500/10 text-red-500";
    default:
      return "bg-gray-500/10 text-gray-400";
  }
}

function getStatusDotColor(status: string): string {
  switch (normalizeStatus(status)) {
    case "pending":
      return "bg-yellow-500";
    case "confirmed":
      return "bg-blue-500";
    case "preparing":
      return "bg-indigo-500";
    case "out for delivery":
      return "bg-purple-500";
    case "delivered":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
}

function getPaymentStatusColor(status: string): string {
  switch (status) {
    case "paid":
      return "bg-green-500/10 text-green-500";
    case "pending":
      return "bg-yellow-500/10 text-yellow-500";
    case "failed":
      return "bg-red-500/10 text-red-500";
    case "refunded":
      return "bg-blue-500/10 text-blue-500";
    default:
      return "bg-gray-500/10 text-gray-400";
  }
}

function getAllowedStatuses(status: Order["status"]): Order["status"][] {
  const transitions: Record<Order["status"], Order["status"][]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["out_for_delivery"],
    out_for_delivery: ["delivered"],
    delivered: [],
    cancelled: [],
  };
  return transitions[status] ?? [];
}

function formatCurrency(amount: number): string {
  if (Number.isNaN(amount)) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatRelativeTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

function OrdersTableSkeleton({ isVendor }: { isVendor: boolean }) {
  return (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg bg-surface-2/50 px-4 py-3"
        >
          <Skeleton className="h-4 w-16" />
          <div className="flex items-center gap-2 flex-1">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          {!isVendor && <Skeleton className="h-4 w-24" />}
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-12" />
          <div className="flex items-center gap-2">
            {isVendor && <Skeleton className="h-8 w-32 rounded-md" />}
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
