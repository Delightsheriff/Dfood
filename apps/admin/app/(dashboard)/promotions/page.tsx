"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";
import {
  Percent,
  Plus,
  Search,
  Trash2,
  Calendar,
  Ticket,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

interface Promotion {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_delivery";
  value: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  status: "active" | "expired" | "inactive";
}

const formSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
  type: z.enum(["percentage", "fixed", "free_delivery"]),
  value: z.coerce.number().min(0, "Value cannot be negative"),
  maxUses: z.coerce.number().min(1, "Must allow at least 1 use"),
  expiryDate: z.string().min(1, "Expiry date is required"),
});

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: "p1",
      code: "WELCOME50",
      type: "percentage",
      value: 50,
      maxUses: 100,
      usedCount: 42,
      expiryDate: "2026-08-15",
      status: "active",
    },
    {
      id: "p2",
      code: "FREESHIP",
      type: "free_delivery",
      value: 0,
      maxUses: 500,
      usedCount: 189,
      expiryDate: "2026-07-22",
      status: "active",
    },
    {
      id: "p3",
      code: "BOGO2000",
      type: "fixed",
      value: 2000,
      maxUses: 50,
      usedCount: 50,
      expiryDate: "2026-06-30",
      status: "expired",
    },
    {
      id: "p4",
      code: "WEEKEND10",
      type: "percentage",
      value: 10,
      maxUses: 200,
      usedCount: 11,
      expiryDate: "2026-09-01",
      status: "inactive",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      code: "",
      type: "percentage",
      value: 0,
      maxUses: 100,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newPromo: Promotion = {
      id: `p-${Date.now()}`,
      code: values.code,
      type: values.type,
      value: values.type === "free_delivery" ? 0 : values.value,
      maxUses: values.maxUses,
      usedCount: 0,
      expiryDate: values.expiryDate,
      status: "active",
    };

    setPromotions((prev) => [newPromo, ...prev]);
    setIsDialogOpen(false);
    form.reset();
    toast.success("Promotion created successfully!");
  };

  const handleDelete = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    toast.success("Promotion deleted");
  };

  const toggleStatus = (id: string) => {
    setPromotions((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (p.status === "expired") return p;
        return {
          ...p,
          status: p.status === "active" ? "inactive" : "active",
        };
      })
    );
  };

  const filteredPromos = promotions.filter((p) =>
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = promotions.filter((p) => p.status === "active").length;
  const totalClaims = promotions.reduce((acc, p) => acc + p.usedCount, 0);

  return (
    <PageShell title="Promotions & Coupons">
      <div className="space-y-6">
        {/* Metric Summaries */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <SpotlightCard className="bg-card border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Promotions
              </span>
              <div className="rounded-lg p-2.5 bg-primary/10">
                <Ticket className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {promotions.length}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {activeCount} active campaigns
            </p>
          </SpotlightCard>

          <SpotlightCard className="bg-card border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Active Promo Codes
              </span>
              <div className="rounded-lg p-2.5 bg-emerald-500/10">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {activeCount}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {promotions.filter((p) => p.status === "inactive").length} paused
            </p>
          </SpotlightCard>

          <SpotlightCard className="bg-card border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Claims
              </span>
              <div className="rounded-lg p-2.5 bg-purple-500/10">
                <Percent className="h-4 w-4 text-purple-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {totalClaims}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Across all code campaigns
            </p>
          </SpotlightCard>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search coupon codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-card border-border text-xs rounded-lg"
            />
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="h-10 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Coupon
          </Button>
        </div>

        {/* Grid List of Coupons */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {filteredPromos.map((promo) => (
            <SpotlightCard
              key={promo.id}
              className="p-5 border border-border bg-card shadow-sm flex flex-col justify-between"
              spotlightColor="rgba(255, 118, 34, 0.03)"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold tracking-wider rounded-lg bg-primary/10 text-primary border border-primary/20">
                      {promo.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        promo.status === "active"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : promo.status === "expired"
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                      }`}
                    >
                      {promo.status}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleStatus(promo.id)}
                    disabled={promo.status === "expired"}
                    className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  >
                    {promo.status === "active" ? (
                      <ToggleRight className="h-6 w-6 text-primary" />
                    ) : (
                      <ToggleLeft className="h-6 w-6" />
                    )}
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-xs font-bold text-foreground">
                    {promo.type === "percentage" && `${promo.value}% Off Store Order`}
                    {promo.type === "fixed" && `₦${promo.value.toLocaleString()} Flat discount`}
                    {promo.type === "free_delivery" && `Free Delivery Option`}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Claims: <span className="font-semibold text-foreground">{promo.usedCount}</span> / {promo.maxUses} uses
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 mt-6 pt-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Expires {promo.expiryDate}
                </span>

                <button
                  onClick={() => handleDelete(promo.id)}
                  className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </SpotlightCard>
          ))}

          {filteredPromos.length === 0 && (
            <div className="col-span-full border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground text-xs">
              No promotions found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      </div>

      {/* Add Coupon Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border p-6 rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              Create Coupon Campaign
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-3">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Promo Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. SUMMER25"
                        {...field}
                        className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs font-mono uppercase"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Discount Type</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full bg-background border border-border focus:border-primary h-10 rounded-lg text-xs px-3 text-foreground"
                      >
                        <option value="percentage">Percentage Off (%)</option>
                        <option value="fixed">Fixed Cash Off (₦)</option>
                        <option value="free_delivery">Free Delivery</option>
                      </select>
                    </FormControl>
                    <FormMessage className="text-[11px] text-red-500" />
                  </FormItem>
                )}
              />

              {form.watch("type") !== "free_delivery" && (
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                        Discount Value
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 15 or 1500"
                          {...field}
                          className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500" />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="maxUses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Max Claims</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="100"
                          {...field}
                          className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Expiry Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="h-10 text-xs font-semibold rounded-lg border-border"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-10 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 rounded-lg shadow-sm"
                >
                  Create Promo
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

