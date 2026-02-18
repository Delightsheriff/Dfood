"use client";

import { Search, Store, ShieldCheck } from "lucide-react";
import { useDashboardRole } from "./DashboardRoleContext";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsPopover } from "./NotificationsPopover";
import { ProfileDropdown } from "./ProfileDropdown";

export function Header() {
  const { role, setRole } = useDashboardRole();

  return (
    <header className="glass sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4 shadow-sm z-10 transition-all">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-text hover:bg-surface-2 hover:text-orange" />
        <div className="hidden md:flex h-6 w-[1px] bg-border mx-2" />

        {/* Role Switcher */}
        <div className="hidden md:flex items-center rounded-lg border border-border bg-black/20 p-1">
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
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-black/10 pl-8 md:w-[200px] lg:w-[320px] h-9 text-sm border border-border text-text focus:outline-none focus:ring-1 focus:ring-orange/50 transition-all"
          />
        </div>

        <NotificationsPopover />
        <ProfileDropdown />
      </div>
    </header>
  );
}
