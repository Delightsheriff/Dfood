"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";
import { StaggerText } from "@/components/ui/custom/StaggerText";
import {
  DollarSign,
  TrendingUp,
  Download,
  CreditCard,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CHART_TOOLTIP_STYLE,
  CHART_AXIS_PROPS,
  CHART_GRID_PROPS,
  BRAND_ORANGE,
  CHART_PALETTE,
} from "@/lib/chart-theme";

interface Transaction {
  id: string;
  orderNumber: string;
  date: string;
  amount: number;
  channel: "paystack" | "wallet" | "cod";
  type: "credit" | "debit";
  status: "settled" | "pending" | "disputed";
}

interface PayoutLog {
  id: string;
  date: string;
  amount: number;
  bank: string;
  account: string;
  status: "completed" | "processing" | "failed";
}

const formSchema = z.object({
  amount: z.coerce.number().min(5000, "Minimum payout limit is ₦5,000"),
  bank: z.string().min(1, "Please select a destination bank"),
  accountNumber: z
    .string()
    .min(10, "Account number must be exactly 10 digits")
    .max(10, "Account number must be exactly 10 digits")
    .regex(/^\d+$/, "Must contain only numeric digits"),
});

export default function FinancialsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TXN-99120",
      orderNumber: "#10240",
      date: "2026-07-15 13:02",
      amount: 8500,
      channel: "paystack",
      type: "credit",
      status: "settled",
    },
    {
      id: "TXN-99119",
      orderNumber: "#10239",
      date: "2026-07-15 11:15",
      amount: 4300,
      channel: "wallet",
      type: "credit",
      status: "settled",
    },
    {
      id: "TXN-99118",
      orderNumber: "#10238",
      date: "2026-07-15 10:04",
      amount: 12000,
      channel: "paystack",
      type: "credit",
      status: "pending",
    },
    {
      id: "TXN-99117",
      orderNumber: "Payout Ref",
      date: "2026-07-14 18:00",
      amount: 45000,
      channel: "wallet",
      type: "debit",
      status: "settled",
    },
    {
      id: "TXN-99116",
      orderNumber: "#10237",
      date: "2026-07-14 15:42",
      amount: 6200,
      channel: "cod",
      type: "credit",
      status: "disputed",
    },
  ]);

  const [payouts, setPayouts] = useState<PayoutLog[]>([
    {
      id: "PAY-112",
      date: "2026-07-14 18:00",
      amount: 45000,
      bank: "Access Bank Plc",
      account: "0012345678",
      status: "completed",
    },
    {
      id: "PAY-111",
      date: "2026-07-07 17:30",
      amount: 80000,
      bank: "GTBank",
      account: "0119876543",
      status: "completed",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      amount: 10000,
      bank: "",
      accountNumber: "",
    },
  });

  const onSubmitPayout = (values: z.infer<typeof formSchema>) => {
    // Compile new payout log
    const newPayout: PayoutLog = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      amount: values.amount,
      bank: values.bank,
      account: values.accountNumber,
      status: "processing",
    };

    // Append to transactions as debit
    const newTxn: Transaction = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      orderNumber: "Payout Ref",
      date: newPayout.date,
      amount: values.amount,
      channel: "wallet",
      type: "debit",
      status: "pending",
    };

    setPayouts((prev) => [newPayout, ...prev]);
    setTransactions((prev) => [newTxn, ...prev]);
    setIsPayoutOpen(false);
    form.reset();
    toast.success("Payout transfer request initiated successfully");
  };

  const chartData = [
    { date: "Jul 10", revenue: 42000, payouts: 0 },
    { date: "Jul 11", revenue: 58000, payouts: 0 },
    { date: "Jul 12", revenue: 64000, payouts: 0 },
    { date: "Jul 13", revenue: 80000, payouts: 0 },
    { date: "Jul 14", revenue: 48000, payouts: 45000 },
    { date: "Jul 15", revenue: 95000, payouts: 0 },
  ];

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = channelFilter === "all" || t.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  const grossEarnings = transactions
    .filter((t) => t.type === "credit" && t.status !== "disputed")
    .reduce((acc, t) => acc + t.amount, 0);

  const pendingSettlement = transactions
    .filter((t) => t.status === "pending")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <PageShell
      title={<StaggerText text="Financials Dashboard" />}
      action={
        <Button
          onClick={() => setIsPayoutOpen(true)}
          className="h-10 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 rounded-lg flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Request Payout
        </Button>
      }
    >
      <div className="space-y-6">
        {/* KPI Summaries */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <SpotlightCard className="bg-card border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Gross Earnings
              </span>
              <div className="rounded-lg p-2.5 bg-primary/10">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              ₦{grossEarnings.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              Accumulated sales credit
            </p>
          </SpotlightCard>

          <SpotlightCard className="bg-card border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Pending Settlement
              </span>
              <div className="rounded-lg p-2.5 bg-amber-500/10">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              ₦{pendingSettlement.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              Processing checks clearing
            </p>
          </SpotlightCard>

          <SpotlightCard className="bg-card border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Disbursed Funds
              </span>
              <div className="rounded-lg p-2.5 bg-purple-500/10">
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              ₦{payouts.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              Released to bank account
            </p>
          </SpotlightCard>
        </div>

        {/* Charts & Payout logs split grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Earnings chart */}
          <SpotlightCard className="bg-card border-border p-6 lg:col-span-2">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground mb-4">
              Revenue vs Payouts Stream
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={BRAND_ORANGE} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={BRAND_ORANGE} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPay" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_PALETTE[2]} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={CHART_PALETTE[2]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" {...CHART_AXIS_PROPS} />
                  <YAxis
                    {...CHART_AXIS_PROPS}
                    tickFormatter={(val) => `₦${(val / 1000).toFixed(0)}K`}
                  />
                  <CartesianGrid {...CHART_GRID_PROPS} />
                  <Tooltip {...CHART_TOOLTIP_STYLE} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={BRAND_ORANGE}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                  <Area
                    type="monotone"
                    dataKey="payouts"
                    stroke={CHART_PALETTE[2]}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPay)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SpotlightCard>

          {/* Payout Logs Table list */}
          <SpotlightCard className="bg-card border-border p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground mb-4">
                Recent Disbursals
              </h3>
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {payouts.map((p) => (
                  <div key={p.id} className="text-xs flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="font-bold text-foreground flex items-center gap-1">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        ₦{p.amount.toLocaleString()}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
                        {p.bank} • {p.account}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                        p.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      }`}>
                        {p.status}
                      </span>
                      <p className="text-[8px] text-muted-foreground mt-1 font-semibold">{p.date.split(" ")[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground border-t border-border/40 pt-4 mt-4 font-semibold">
              Payouts clear in 24 hours of approval.
            </p>
          </SpotlightCard>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by txn or order reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-card border-border text-xs rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-card border border-border h-10 rounded-lg text-xs px-3 text-foreground"
            >
              <option value="all">All Channels</option>
              <option value="paystack">Paystack Card</option>
              <option value="wallet">In-App Wallet</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
        </div>

        {/* Transactions ledger table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-muted/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">TXN Identifier</th>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Ledger Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right pr-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {filteredTxns.map((txn) => (
                <tr key={txn.id} className="hover:bg-muted/10 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground font-mono">{txn.id}</td>
                  <td className="py-3 px-4 font-semibold text-muted-foreground">{txn.orderNumber}</td>
                  <td className="py-3 px-4 font-bold text-foreground font-mono">
                    ₦{txn.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 capitalize font-semibold text-muted-foreground">{txn.channel}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-0.5 font-bold ${
                      txn.type === "credit" ? "text-emerald-500" : "text-primary"
                    }`}>
                      {txn.type === "credit" ? (
                        <ArrowDownLeft className="h-3 w-3" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3" />
                      )}
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      txn.status === "settled"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : txn.status === "pending"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right pr-6 text-muted-foreground font-semibold">
                    {txn.date}
                  </td>
                </tr>
              ))}

              {filteredTxns.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No transactions found in this ledger.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Payout Dialog */}
      <Dialog open={isPayoutOpen} onOpenChange={setIsPayoutOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border p-6 rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Initiate Transfer Payout
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitPayout)} className="space-y-4 pt-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                      Payout Value (₦)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="15000"
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
                name="bank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground font-bold">
                      Destination Bank
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full bg-background border border-border focus:border-primary h-10 rounded-lg text-xs px-3 text-foreground"
                      >
                        <option value="">Select bank...</option>
                        <option value="GTBank">Guaranty Trust Bank</option>
                        <option value="Access Bank Plc">Access Bank</option>
                        <option value="Zenith Bank Plc">Zenith Bank</option>
                        <option value="UBA">United Bank for Africa</option>
                      </select>
                    </FormControl>
                    <FormMessage className="text-[11px] text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                      10-Digit Account Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0123456789"
                        {...field}
                        className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs font-mono"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPayoutOpen(false)}
                  className="h-10 text-xs font-semibold rounded-lg border-border"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-10 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 rounded-lg shadow-sm"
                >
                  Request Payout
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
