"use client";

import { Search, Bell, Settings, Store, ShieldCheck, Menu } from "lucide-react";
import { useDashboardRole } from "./DashboardRoleContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MobileSidebar } from "./MobileSidebar";

export function Header() {
  const { role, setRole } = useDashboardRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:px-8">
      <MobileSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex items-center gap-4 md:gap-6 flex-1">
        <button
          className="md:hidden text-text-muted hover:text-text"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <h1 className="text-lg md:text-xl font-bold text-text hidden sm:block">
          Dashboard
        </h1>
        <div className="relative w-full max-w-xs md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
          <input
            type="text"
            placeholder="Search orders, customers, items..."
            className="h-10 w-full rounded-lg border border-border bg-black/20 pl-10 pr-4 text-sm text-text placeholder:text-text-dim focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Switcher */}
        <div className="flex items-center rounded-lg border border-border bg-black/20 p-1">
          <button
            onClick={() => setRole("vendor")}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-all font-sans",
              role === "vendor"
                ? "bg-surface text-orange shadow-sm border border-border/50"
                : "text-text-muted hover:text-text",
            )}
          >
            <Store className="h-3.5 w-3.5" />
            Vendor
          </button>
          <button
            onClick={() => setRole("admin")}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-all font-sans",
              role === "admin"
                ? "bg-surface text-orange shadow-sm border border-border/50"
                : "text-text-muted hover:text-text",
            )}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </button>
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:bg-surface-2 hover:text-text">
          <Bell className="h-4 w-4" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:bg-surface-2 hover:text-text">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
