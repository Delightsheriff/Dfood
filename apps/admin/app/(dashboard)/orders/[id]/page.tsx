"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";
import { useOrder, useUpdateOrderStatus } from "@/hooks/useOrders";
import { Order } from "@/services/orders.service";
import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  User,
  Store,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Status helpers ───────────────────────────────────────────────── */

const STATUS_STEPS: Order["status"][] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

function normalizeStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

function formatStatusLabel(status: string) {
  return normalizeStatus(status)
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function getStatusColor(status: string) {
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

function getStatusDotColor(status: string) {
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

function getPaymentStatusColor(status: string) {
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

function formatCurrency(amount: number) {
  if (Number.isNaN(amount)) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-NG", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ─── Page Component ───────────────────────────────────────────────── */

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { isVendor } = useDashboardRole();
  const { data: order, isLoading, isError } = useOrder({ isVendor, id });
  const updateStatus = useUpdateOrderStatus({ isVendor });
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusChange = async (status: Order["status"]) => {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      await updateStatus.mutateAsync({ id: order._id, status });
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <PageShell title="Order Details">
        <OrderDetailSkeleton />
      </PageShell>
    );
  }

  /* ---------- Error ---------- */
  if (isError || !order) {
    return (
      <PageShell title="Order Details">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="rounded-full bg-red-500/10 p-4 mb-4">
            <Package className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-lg font-semibold text-text mb-1">
            Order not found
          </p>
          <p className="text-sm text-text-muted mb-6">
            This order may have been removed or you don&apos;t have access.
          </p>
          <Button
            variant="outline"
            className="border-border"
            onClick={() => router.push("/orders")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </PageShell>
    );
  }

  /* ---------- Derived data ---------- */
  const customerName =
    typeof order.customerId === "object"
      ? order.customerId.name || "Customer"
      : "Customer";
  const customerEmail =
    typeof order.customerId === "object" ? order.customerId.email : undefined;
  const customerPhone =
    typeof order.customerId === "object" ? order.customerId.phone : undefined;

  const restaurantName =
    typeof order.restaurantId === "object"
      ? order.restaurantId.name || "Unknown"
      : "Unknown";
  const restaurantAddress =
    typeof order.restaurantId === "object"
      ? order.restaurantId.address
      : undefined;

  const allowedStatuses = getAllowedStatuses(order.status);
  const isCancelled = order.status === "cancelled";
  const currentStepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <PageShell
      title={`Order ${order.orderNumber?.startsWith("#") ? order.orderNumber : `#${order.orderNumber}`}`}
      action={
        <Button
          variant="outline"
          className="border-border text-text-muted hover:text-text"
          onClick={() => router.push("/orders")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      }
    >
      {/* ── Status Progress ───────────────────────────────────────── */}
      <Card className="border-border bg-surface">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg text-text">Order Status</CardTitle>
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
                {formatStatusLabel(order.status)}
              </Badge>
            </div>

            {/* Status update (vendor only) */}
            {isVendor && allowedStatuses.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Move to:</span>
                <Select
                  onValueChange={(v) =>
                    handleStatusChange(v as Order["status"])
                  }
                  disabled={updatingStatus}
                >
                  <SelectTrigger className="h-9 text-sm bg-surface-2 border-border/60 w-44">
                    {updatingStatus ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <SelectValue placeholder="Select status..." />
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
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress timeline */}
          {!isCancelled ? (
            <div className="flex items-center gap-0">
              {STATUS_STEPS.map((step, i) => {
                const isCompleted = currentStepIdx >= i;
                const isCurrent = currentStepIdx === i;
                return (
                  <div
                    key={step}
                    className="flex items-center flex-1 last:flex-none"
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                          isCompleted
                            ? "bg-orange text-white"
                            : "bg-surface-2 text-text-muted",
                          isCurrent && "ring-2 ring-orange/30",
                        )}
                      >
                        {i + 1}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-medium text-center whitespace-nowrap",
                          isCompleted ? "text-orange" : "text-text-muted",
                        )}
                      >
                        {formatStatusLabel(step)}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-0.5 mx-1 rounded-full -mt-4.5",
                          currentStepIdx > i ? "bg-orange" : "bg-surface-2",
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-red-400">
              This order has been cancelled.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Main content grid ─────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Items + Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle className="text-base text-text flex items-center gap-2">
                <Package className="h-4 w-4 text-text-muted" />
                Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {order.items.map((item, idx) => (
                  <div
                    key={`${item.foodItemId}-${idx}`}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    {/* Item image */}
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-surface-2 shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-text-muted" />
                        </div>
                      )}
                    </div>

                    {/* Item info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>

                    {/* Subtotal */}
                    <span className="font-mono text-sm font-semibold text-text tabular-nums">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-border/40 px-6 py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-mono text-text tabular-nums">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Delivery Fee</span>
                  <span className="font-mono text-text tabular-nums">
                    {formatCurrency(order.deliveryFee)}
                  </span>
                </div>
                <Separator className="bg-border/40" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-text">Total</span>
                  <span className="font-mono text-orange tabular-nums">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle className="text-base text-text flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-text-muted" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <InfoField
                  label="Method"
                  value={capitalise(order.paymentMethod)}
                />
                <InfoField
                  label="Status"
                  value={
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs rounded-full px-2.5 py-0.5 border-0",
                        getPaymentStatusColor(order.paymentStatus),
                      )}
                    >
                      {capitalise(order.paymentStatus)}
                    </Badge>
                  }
                />
                {order.paystackReference && (
                  <InfoField
                    label="Reference"
                    value={
                      <span className="font-mono text-xs">
                        {order.paystackReference}
                      </span>
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Customer, Restaurant, Delivery, Notes, Timestamps */}
        <div className="space-y-6">
          {/* Customer */}
          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle className="text-base text-text flex items-center gap-2">
                <User className="h-4 w-4 text-text-muted" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoField label="Name" value={customerName} />
              {customerEmail && (
                <InfoField label="Email" value={customerEmail} />
              )}
              {customerPhone && (
                <InfoField label="Phone" value={customerPhone} />
              )}
            </CardContent>
          </Card>

          {/* Restaurant */}
          {!isVendor && (
            <Card className="border-border bg-surface">
              <CardHeader>
                <CardTitle className="text-base text-text flex items-center gap-2">
                  <Store className="h-4 w-4 text-text-muted" />
                  Restaurant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoField label="Name" value={restaurantName} />
                {restaurantAddress && (
                  <InfoField label="Address" value={restaurantAddress} />
                )}
              </CardContent>
            </Card>
          )}

          {/* Delivery Address */}
          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle className="text-base text-text flex items-center gap-2">
                <MapPin className="h-4 w-4 text-text-muted" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text">
                {order.deliveryAddress.street}
              </p>
              <p className="text-sm text-text-muted mt-0.5">
                {order.deliveryAddress.city}, {order.deliveryAddress.state}
              </p>
            </CardContent>
          </Card>

          {/* Customer Notes */}
          {order.customerNotes && (
            <Card className="border-border bg-surface">
              <CardHeader>
                <CardTitle className="text-base text-text flex items-center gap-2">
                  <FileText className="h-4 w-4 text-text-muted" />
                  Customer Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-muted italic">
                  &ldquo;{order.customerNotes}&rdquo;
                </p>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle className="text-base text-text flex items-center gap-2">
                <Clock className="h-4 w-4 text-text-muted" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoField label="Created" value={formatDate(order.createdAt)} />
              <InfoField label="Updated" value={formatDate(order.updatedAt)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

/* ─── Small components ─────────────────────────────────────────────── */

function InfoField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1">
        {label}
      </p>
      <div className="text-sm text-text">{value}</div>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Status card */}
      <Card className="border-border bg-surface">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-9 w-44" />
          </div>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <Skeleton className="h-8 w-8 rounded-full" />
                {i < 4 && <Skeleton className="flex-1 h-0.5 mx-1" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border bg-surface">
            <CardContent className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-border bg-surface">
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
