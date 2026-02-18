"use client";

import { Store, ShieldCheck } from "lucide-react";
import { useDashboardRole } from "./DashboardRoleContext";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsPopover } from "./NotificationsPopover";
import { ProfileDropdown } from "./ProfileDropdown";
import { SearchDialog } from "./SearchDialog";

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
        <div className="hidden md:block">
          <SearchDialog />
        </div>

        <div className="flex items-center gap-2">
          <NotificationsPopover />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
