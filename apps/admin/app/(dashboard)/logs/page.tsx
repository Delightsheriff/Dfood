"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";
import {
  History,
  Search,
  Filter,
  ShieldAlert,
  CheckCircle,
  Clock,
  Globe,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  ip: string;
  status: "success" | "warning" | "failed";
}

export default function LogsPage() {
  const [logs] = useState<AuditLog[]>([
    {
      id: "log1",
      timestamp: "2026-07-15 13:42:11",
      actor: "Delight Sheriff",
      role: "super_admin",
      action: "Onboarded restaurant 'Mama Titi's Kitchen'",
      ip: "102.89.34.120",
      status: "success",
    },
    {
      id: "log2",
      timestamp: "2026-07-15 12:15:33",
      actor: "Chidi E.",
      role: "restaurant_admin",
      action: "Modified coupon code 'WELCOME50' usage limit",
      ip: "197.210.8.44",
      status: "success",
    },
    {
      id: "log3",
      timestamp: "2026-07-15 10:02:18",
      actor: "System Sentinel",
      role: "support",
      action: "Security warning: Multiple failed login attempts for 'manager@chow.com'",
      ip: "89.207.132.8",
      status: "warning",
    },
    {
      id: "log4",
      timestamp: "2026-07-15 09:30:00",
      actor: "Amaka C.",
      role: "finance",
      action: "Exported Q2 tax and payouts report",
      ip: "102.89.44.89",
      status: "success",
    },
    {
      id: "log5",
      timestamp: "2026-07-14 18:22:45",
      actor: "Funmi A.",
      role: "content_manager",
      action: "Created food item 'Jollof Rice with Beef'",
      ip: "197.210.64.12",
      status: "success",
    },
    {
      id: "log6",
      timestamp: "2026-07-14 14:05:12",
      actor: "Unknown Operator",
      role: "guest",
      action: "Unauthorized request to endpoint: /api/v1/admin/security/configs",
      ip: "45.120.21.3",
      status: "failed",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const getRoleLabel = (role: string) => {
    return role.replace(/_/g, " ").toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "manager":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "finance":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "support":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "restaurant_admin":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "content_manager":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || log.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <PageShell title="Platform Audit Trail">
      <div className="space-y-6">
        {/* KPI metrics using SpotlightCard */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <SpotlightCard className="bg-card border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Audit Logs
              </span>
              <div className="rounded-lg p-2.5 bg-primary/10">
                <History className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {logs.length}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              Event tracking active
            </p>
          </SpotlightCard>

          <SpotlightCard className="bg-card border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Successful Actions
              </span>
              <div className="rounded-lg p-2.5 bg-emerald-500/10">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {logs.filter((l) => l.status === "success").length}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              No anomalies reported
            </p>
          </SpotlightCard>

          <SpotlightCard className="bg-card border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Warnings & Failures
              </span>
              <div className="rounded-lg p-2.5 bg-red-500/10">
                <ShieldAlert className="h-4 w-4 text-red-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {logs.filter((l) => l.status !== "success").length}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              Requires support review
            </p>
          </SpotlightCard>
        </div>

        {/* Toolbar Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by action or user name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-card border-border text-xs rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-card border border-border h-10 rounded-lg text-xs px-3 text-foreground"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Platform Owner</option>
              <option value="manager">Operations Manager</option>
              <option value="support">Customer Support</option>
              <option value="restaurant_admin">Restaurant Admin</option>
              <option value="content_manager">Catalog Editor</option>
              <option value="finance">Financial Auditor</option>
            </select>
          </div>
        </div>

        {/* Chronological Logs List */}
        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
          <div className="divide-y divide-border/40">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 shrink-0">
                    {log.status === "success" && (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    )}
                    {log.status === "warning" && (
                      <ShieldAlert className="h-4 w-4 text-amber-500 animate-pulse" />
                    )}
                    {log.status === "failed" && (
                      <ShieldAlert className="h-4 w-4 text-red-500 animate-bounce" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {log.actor}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold border ${getRoleColor(
                          log.role
                        )}`}
                      >
                        {getRoleLabel(log.role)}
                      </span>
                    </div>
                    <p className="text-xs text-foreground mt-1.5 leading-relaxed">
                      {log.action}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 text-[10px] text-muted-foreground font-semibold shrink-0">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {log.timestamp}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Globe className="h-3 w-3" />
                    {log.ip}
                  </span>
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-xs">
                No logs match your search filter criteria
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
