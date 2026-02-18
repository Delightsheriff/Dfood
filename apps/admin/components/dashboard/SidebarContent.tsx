"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardRole } from "./DashboardRoleContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Users,
  DollarSign,
  Settings,
  Bell,
  UtensilsCrossed,
  LineChart,
} from "lucide-react";

interface SidebarContentProps {
  onLinkClick?: () => void;
}

export function SidebarContent({ onLinkClick }: SidebarContentProps) {
  const { role, isVendor } = useDashboardRole();
  const pathname = usePathname();

  const adminLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Orders", icon: ShoppingBag, badge: "12" },
    { href: "/restaurants", label: "Restaurants", icon: Store },
    { href: "/users", label: "Users", icon: Users },
    { href: "/financials", label: "Financials", icon: DollarSign },
  ];

  const vendorLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Orders", icon: ShoppingBag, badge: "5" },
    { href: "/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/analytics", label: "Analytics", icon: LineChart },
  ];

  const links = isVendor ? vendorLinks : adminLinks;

  return (
    <div className="flex h-full flex-col bg-surface text-text">
      <div className="flex h-16 items-center border-b border-border px-6">
        <span className="text-xl font-bold tracking-wider text-orange">
          FOOD
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <div className="mb-2 px-6 text-xs font-semibold uppercase tracking-wider text-text-muted font-mono">
          Menu
        </div>
        <nav className="space-y-1 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onLinkClick}
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative",
                  isActive
                    ? "bg-orange/10 text-orange font-semibold"
                    : "text-text-muted hover:bg-surface-2 hover:text-text",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 h-3/5 w-1 rounded-r-sm bg-orange" />
                )}
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive
                      ? "text-orange"
                      : "text-text-muted group-hover:text-text",
                  )}
                />
                {link.label}
                {link.badge && (
                  <span className="ml-auto rounded-full bg-orange px-2 py-0.5 text-[10px] font-bold text-white font-mono">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 mb-2 px-6 text-xs font-semibold uppercase tracking-wider text-text-muted font-mono">
          Settings
        </div>
        <nav className="space-y-1 px-3">
          <Link
            href="/settings"
            onClick={onLinkClick}
            className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-2 hover:text-text transition-all"
          >
            <Settings className="mr-3 h-5 w-5 text-text-muted group-hover:text-text" />
            {isVendor ? "Restaurant Settings" : "Settings"}
          </Link>
          <Link
            href="/notifications"
            onClick={onLinkClick}
            className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-2 hover:text-text transition-all"
          >
            <Bell className="mr-3 h-5 w-5 text-text-muted group-hover:text-text" />
            Notifications
          </Link>
        </nav>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-2 cursor-pointer transition-colors">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange to-orange-dim text-sm font-bold text-white">
            {isVendor ? "RO" : "AU"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold text-text">
              {isVendor ? "Restaurant Owner" : "Admin User"}
            </p>
            <p className="truncate text-xs font-mono text-text-muted">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
