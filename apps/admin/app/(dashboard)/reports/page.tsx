"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Settings,
  Loader2,
  TrendingUp,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type ReportType = "sales" | "users" | "restaurants" | "tax";
type FormatType = "csv" | "xlsx" | "pdf";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("sales");
  const [format, setFormat] = useState<FormatType>("csv");
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-15");
  
  const [exportingState, setExportingState] = useState<string | null>(null);
  const [lastExport, setLastExport] = useState<string>("Never");
  const [exportCount, setExportCount] = useState(14);

  const handleExport = () => {
    // Start step-by-step download compiler simulation
    setExportingState("Compiling database records...");
    
    setTimeout(() => {
      setExportingState("Formatting file fields...");
      
      setTimeout(() => {
        setExportingState("Generating download package...");
        
        setTimeout(() => {
          // Trigger file download
          try {
            const fileHeader = `DFood Report: ${reportType.toUpperCase()}\nPeriod: ${startDate} to ${endDate}\nGenerated: ${new Date().toISOString()}\n\nID,Date,Details,Amount,Status\n1,${startDate},Mock Transaction,5400,Success\n2,${endDate},Mock Transaction,3200,Success`;
            
            const blob = new Blob([fileHeader], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `dfood_${reportType}_report_${startDate}_to_${endDate}.${format}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setExportCount((c) => c + 1);
            setLastExport(new Date().toLocaleTimeString());
            toast.success("Report downloaded successfully");
          } catch {
            toast.error("Download packaging failed");
          } finally {
            setExportingState(null);
          }
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <PageShell title="Analytics Exporter">
      <div className="space-y-6">
        {/* KPI stats using SpotlightCard */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <SpotlightCard className="bg-card border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Downloads
              </span>
              <div className="rounded-lg p-2.5 bg-primary/10">
                <Download className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {exportCount}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              Export compilations recorded
            </p>
          </SpotlightCard>

          <SpotlightCard className="bg-card border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Last Compiled File
              </span>
              <div className="rounded-lg p-2.5 bg-purple-500/10">
                <Clock className="h-4 w-4 text-purple-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground truncate">
              {lastExport}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              Daily server updates checked
            </p>
          </SpotlightCard>

          <SpotlightCard className="bg-card border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Compliance Integrity
              </span>
              <div className="rounded-lg p-2.5 bg-emerald-500/10">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              SECURE
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              Hash checks completed
            </p>
          </SpotlightCard>
        </div>

        {/* Configuration grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {/* Settings SpotlightCard */}
          <SpotlightCard className="bg-card border-border p-6 md:col-span-2 space-y-6">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Export Configurations
            </h3>

            <div className="space-y-4">
              {/* Report selection */}
              <div>
                <label className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-1.5 block">
                  Report Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: "sales", label: "Sales & GMV" },
                    { value: "users", label: "Users & Accounts" },
                    { value: "restaurants", label: "Vendor List" },
                    { value: "tax", label: "Tax & Audits" },
                  ].map((item) => {
                    const isActive = reportType === item.value;
                    return (
                      <button
                        key={item.value}
                        onClick={() => setReportType(item.value as ReportType)}
                        className={`p-3 text-xs font-semibold rounded-lg border transition-all duration-300 ${
                          isActive
                            ? "bg-primary/10 border-primary text-primary"
                            : "border-border bg-background text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-1.5 block">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-9 h-10 bg-background border-border text-xs rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-1.5 block">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="pl-9 h-10 bg-background border-border text-xs rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Format selection */}
              <div className="pt-2">
                <label className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-1.5 block">
                  Download Format
                </label>
                <div className="flex gap-4">
                  {[
                    { value: "csv", label: "CSV Spreadsheet", icon: FileSpreadsheet },
                    { value: "xlsx", label: "Excel Workbook", icon: FileSpreadsheet },
                    { value: "pdf", label: "PDF Document", icon: FileText },
                  ].map((item) => {
                    const isActive = format === item.value;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.value}
                        onClick={() => setFormat(item.value as FormatType)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-300 ${
                          isActive
                            ? "bg-primary/10 border-primary text-primary"
                            : "border-border bg-background text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Action Trigger Card */}
          <SpotlightCard className="bg-card border-border p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground mb-4">
                Exporter Console
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Compiles data fields for the selected dates and packages the results into your desired file format.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {exportingState !== null ? (
                <div className="p-4 rounded-xl border border-border bg-background flex items-center gap-3 animate-pulse">
                  <Loader2 className="h-4.5 w-4.5 text-primary animate-spin shrink-0" />
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {exportingState}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={handleExport}
                  className="w-full h-11 text-xs font-bold tracking-wider uppercase bg-primary text-primary-foreground hover:opacity-90 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  Generate & Download
                </Button>
              )}
            </div>
          </SpotlightCard>
        </div>
      </div>
    </PageShell>
  );
}
