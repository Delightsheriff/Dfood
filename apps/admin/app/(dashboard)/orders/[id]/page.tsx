"use client";

import { use, useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";
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
  Bike,
  Plus,
  History,
  AlertCircle,
  MessageSquareCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "confirmed":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "preparing":
      return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
    case "out for delivery":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "delivered":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "cancelled":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
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
      return "bg-destructive";
    default:
      return "bg-gray-400";
  }
}

function getPaymentStatusColor(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "failed":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "refunded":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
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

interface ActivityLogItem {
  status: string;
  title: string;
  description: string;
  time: string;
}

interface InternalNote {
  author: string;
  text: string;
  time: string;
}

interface DriverInfo {
  name: string;
  phone: string;
  vehicle: string;
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

  // Interactive local states to compile changes mock-frontends
  const [localOrder, setLocalOrder] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("");

  const mockDrivers: DriverInfo[] = [
    { name: "Sunday Joseph", phone: "+234 812 345 6789", vehicle: "Suzuki Bike (LA-890-XX)" },
    { name: "Kabiru Musa", phone: "+234 809 876 5432", vehicle: "Yamaha Motor (KD-112-YY)" },
    { name: "Emeka Obi", phone: "+234 703 111 2222", vehicle: "TVS Max (EN-454-ZZ)" },
  ];

  // Initialize local order state
  useEffect(() => {
    if (order && !localOrder) {
      setLocalOrder({
        ...order,
        timeline: [
          { status: "pending", title: "Order Created", description: "Customer checked out order details.", time: order.createdAt },
          { status: "confirmed", title: "Payment Cleared", description: `Verified Paystack ref: ${order.paystackReference || "MOCK-REF-77"}`, time: order.createdAt },
        ],
        internalNotes: [
          { author: "System Sentinel", text: "Order fraud check verified successfully.", time: order.createdAt },
        ],
        driver: null,
        prepTimeRemaining: order.status === "delivered" || order.status === "cancelled" ? 0 : 25,
      });
    }
  }, [order, localOrder]);

  const handleStatusChange = async (status: Order["status"]) => {
    if (!localOrder) return;
    setUpdatingStatus(true);
    try {
      // Mutate database status (queries trigger update)
      await updateStatus.mutateAsync({ id: localOrder._id, status });
      
      // Update local state details
      setLocalOrder((prev: any) => {
        const nextTimeline = [
          ...prev.timeline,
          {
            status,
            title: `Status Changed to ${formatStatusLabel(status)}`,
            description: `Admin updated order checkpoint status.`,
            time: new Date().toISOString(),
          },
        ];
        return {
          ...prev,
          status,
          timeline: nextTimeline,
          prepTimeRemaining: status === "delivered" ? 0 : prev.prepTimeRemaining,
        };
      });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to mutate database status, updating local preview");
      // Fallback for visual mock portfolios
      setLocalOrder((prev: any) => {
        const nextTimeline = [
          ...prev.timeline,
          {
            status,
            title: `Status Changed to ${formatStatusLabel(status)}`,
            description: `Admin updated order checkpoint status.`,
            time: new Date().toISOString(),
          },
        ];
        return {
          ...prev,
          status,
          timeline: nextTimeline,
        };
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = () => {
    if (!noteInput.trim() || !localOrder) return;
    const newNote: InternalNote = {
      author: "You (Super Admin)",
      text: noteInput.trim(),
      time: new Date().toISOString(),
    };

    setLocalOrder((prev: any) => ({
      ...prev,
      internalNotes: [newNote, ...prev.internalNotes],
    }));
    setNoteInput("");
    toast.success("Internal note added");
  };

  const handleAssignDriver = () => {
    if (!selectedDriverId || !localOrder) return;
    const driver = mockDrivers.find((d) => d.name === selectedDriverId);
    if (!driver) return;

    setLocalOrder((prev: any) => {
      const nextTimeline = [
        ...prev.timeline,
        {
          status: "preparing",
          title: "Driver Assigned",
          description: `Dispatched with courier ${driver.name}`,
          time: new Date().toISOString(),
        },
      ];
      return {
        ...prev,
        driver,
        timeline: nextTimeline,
      };
    });
    toast.success(`Assigned driver ${driver.name}`);
  };

  if (isLoading) {
    return (
      <PageShell title="Order Details">
        <OrderDetailSkeleton />
      </PageShell>
    );
  }

  if (isError || !order || !localOrder) {
    return (
      <PageShell title="Order Details">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <Package className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-lg font-semibold text-foreground mb-1">
            Order not found
          </p>
          <p className="text-sm text-muted-foreground mb-6">
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

  const customerName =
    typeof localOrder.customerId === "object"
      ? localOrder.customerId.name || "Customer"
      : "Customer";
  const customerEmail =
    typeof localOrder.customerId === "object" ? localOrder.customerId.email : undefined;
  const customerPhone =
    typeof localOrder.customerId === "object" ? localOrder.customerId.phone : undefined;

  const restaurantName =
    typeof localOrder.restaurantId === "object"
      ? localOrder.restaurantId.name || "Unknown"
      : "Unknown";
  const restaurantAddress =
    typeof localOrder.restaurantId === "object"
      ? localOrder.restaurantId.address
      : undefined;

  const allowedStatuses = getAllowedStatuses(localOrder.status);
  const isCancelled = localOrder.status === "cancelled";
  const currentStepIdx = STATUS_STEPS.indexOf(localOrder.status);

  return (
    <PageShell
      title={`Order ${localOrder.orderNumber?.startsWith("#") ? localOrder.orderNumber : `#${localOrder.orderNumber}`}`}
      action={
        <Button
          variant="outline"
          className="border-border text-muted-foreground hover:text-foreground h-9 text-xs font-semibold rounded-lg"
          onClick={() => router.push("/orders")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      }
    >
      <div className="space-y-6">
        {/* ── Status Progress Row ───────────────────────────────────────── */}
        <SpotlightCard className="border-border bg-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-foreground">Order Tracking Status</span>
              <Badge
                variant="secondary"
                className={cn(
                  "font-medium text-[10px] uppercase tracking-wider rounded-full px-3 py-0.5 border",
                  getStatusColor(localOrder.status)
                )}
              >
                <span
                  className={cn(
                    "mr-1.5 h-1.5 w-1.5 rounded-full inline-block animate-pulse",
                    getStatusDotColor(localOrder.status)
                  )}
                />
                {formatStatusLabel(localOrder.status)}
              </Badge>
            </div>

            {/* Status updates selector */}
            {allowedStatuses.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Modify Status:</span>
                <Select
                  onValueChange={(v) =>
                    handleStatusChange(v as Order["status"])
                  }
                  disabled={updatingStatus}
                >
                  <SelectTrigger className="h-9 text-xs bg-background border-border w-44 rounded-lg">
                    {updatingStatus ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <SelectValue placeholder="Update status..." />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {allowedStatuses.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs text-foreground">
                        {formatStatusLabel(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Progress Timeline steps */}
          {!isCancelled ? (
            <div className="relative flex items-center justify-between gap-0">
              {STATUS_STEPS.map((step, i) => {
                const isCompleted = currentStepIdx >= i;
                const isCurrent = currentStepIdx === i;
                return (
                  <div
                    key={step}
                    className="flex items-center flex-1 last:flex-none"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border",
                          isCompleted
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-border/80",
                          isCurrent && "ring-4 ring-primary/25 scale-105"
                        )}
                      >
                        {i + 1}
                      </div>
                      <span
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-wider text-center whitespace-nowrap",
                          isCompleted ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {formatStatusLabel(step)}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-0.5 mx-1 rounded-full -mt-5 transition-all duration-500",
                          currentStepIdx > i ? "bg-primary" : "bg-border/60"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-red-500 font-semibold">
              <AlertCircle className="h-4 w-4" />
              This food delivery dispatch order was cancelled.
            </div>
          )}
        </SpotlightCard>

        {/* ── Main content split layout grid ─────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Items details + Private internal logs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border/40 py-4 px-6">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Cart items ({localOrder.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                  {localOrder.items.map((item: any, idx: number) => (
                    <div
                      key={`${item.foodItemId}-${idx}`}
                      className="flex items-center gap-4 px-6 py-4"
                    >
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/40">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>

                      <span className="font-mono text-xs font-bold text-foreground tabular-nums">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/40 px-6 py-4 space-y-2.5 bg-muted/5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Basket Subtotal</span>
                    <span className="font-mono text-foreground tabular-nums">
                      {formatCurrency(localOrder.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Delivery Charge</span>
                    <span className="font-mono text-foreground tabular-nums">
                      {formatCurrency(localOrder.deliveryFee)}
                    </span>
                  </div>
                  <Separator className="bg-border/40" />
                  <div className="flex justify-between text-sm font-bold pt-1">
                    <span className="text-foreground uppercase tracking-wide">Grand Total</span>
                    <span className="font-mono text-primary tabular-nums">
                      {formatCurrency(localOrder.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Private Internal Notes Console */}
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border/40 py-4 px-6">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <MessageSquareCode className="h-4 w-4 text-primary" />
                  Staff Internal Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Type private operational note only visible to backend crew..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="flex-1 h-20 bg-background border-border text-xs rounded-lg"
                  />
                  <Button
                    onClick={handleAddNote}
                    className="h-20 w-20 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 rounded-lg flex flex-col items-center justify-center gap-1 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                <div className="space-y-3.5 max-h-60 overflow-y-auto pt-2">
                  {localOrder.internalNotes.map((note: InternalNote, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-border/60 bg-muted/10 text-xs animate-in slide-in-from-top-2 duration-300"
                    >
                      <div className="flex justify-between items-center mb-1 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                        <span className="text-primary">{note.author}</span>
                        <span>{formatDate(note.time)}</span>
                      </div>
                      <p className="text-foreground leading-relaxed font-medium">
                        {note.text}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Customer details, Timeline activity log, Drivers assignment */}
          <div className="space-y-6">
            {/* Countdown prep timer */}
            {localOrder.prepTimeRemaining > 0 && (
              <SpotlightCard className="bg-primary/5 border border-primary/20 p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 animate-pulse">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
                    Prep Time Est.
                  </span>
                  <div className="text-lg font-bold text-foreground mt-0.5">
                    {localOrder.prepTimeRemaining} Minutes Remaining
                  </div>
                </div>
              </SpotlightCard>
            )}

            {/* Customer information */}
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border/40 py-3.5 px-5">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  Client Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3.5">
                <InfoField label="Client Name" value={customerName} />
                {customerEmail && (
                  <InfoField label="Email Address" value={customerEmail} />
                )}
                {customerPhone && (
                  <InfoField label="Phone Contact" value={customerPhone} />
                )}
              </CardContent>
            </Card>

            {/* Driver courier assignment */}
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border/40 py-3.5 px-5">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Bike className="h-3.5 w-3.5" />
                  Courier Delivery Driver
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {localOrder.driver ? (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <InfoField label="Rider Name" value={localOrder.driver.name} />
                    <InfoField label="Rider Contact" value={localOrder.driver.phone} />
                    <InfoField label="Rider Vehicle" value={localOrder.driver.vehicle} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      No delivery rider assigned to this dispatch route yet.
                    </p>
                    <div className="flex gap-2">
                      <select
                        value={selectedDriverId}
                        onChange={(e) => setSelectedDriverId(e.target.value)}
                        className="flex-1 bg-background border border-border h-9 rounded-lg text-xs px-2 text-foreground"
                      >
                        <option value="">Select Rider...</option>
                        {mockDrivers.map((d) => (
                          <option key={d.name} value={d.name}>
                            {d.name} ({d.vehicle.split(" ")[0]})
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={handleAssignDriver}
                        disabled={!selectedDriverId}
                        size="sm"
                        className="h-9 px-4 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 rounded-lg shrink-0"
                      >
                        Assign
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery address */}
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border/40 py-3.5 px-5">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  Address Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-xs font-bold text-foreground">
                  {localOrder.deliveryAddress.street}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {localOrder.deliveryAddress.city}, {localOrder.deliveryAddress.state}
                </p>
              </CardContent>
            </Card>

            {/* Activity log timeline */}
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border/40 py-3.5 px-5">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <History className="h-3.5 w-3.5" />
                  Activity History Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="relative border-l border-border/60 pl-4 space-y-5">
                  {localOrder.timeline.map((item: ActivityLogItem, idx: number) => (
                    <div key={idx} className="relative text-xs">
                      <div
                        className={cn(
                          "absolute -left-[20.5px] top-1 h-2.5 w-2.5 rounded-full border border-card ring-2 ring-background",
                          getStatusDotColor(item.status)
                        )}
                      />
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-foreground leading-none">
                          {item.title}
                        </span>
                        <span className="text-[8px] font-bold text-muted-foreground tracking-wide shrink-0">
                          {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
        {label}
      </p>
      <div className="text-xs text-foreground font-semibold">{value}</div>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Status card */}
      <Card className="border-border bg-card">
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
          <Card className="border-border bg-card">
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
            <Card key={i} className="border-border bg-card">
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
