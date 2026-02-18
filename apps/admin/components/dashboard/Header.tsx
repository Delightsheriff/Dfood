"use client";

import {
  Bell,
  Check,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";
import { useDashboardRole } from "./DashboardRoleContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  const { role, setRole, isVendor } = useDashboardRole();

  const notifications = [
    { title: "New Order #1234", time: "2 mins ago", read: false },
    { title: "Payment Received", time: "1 hour ago", read: true },
    { title: "System Update", time: "5 hours ago", read: true },
  ];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-surface px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="hidden md:flex h-6 w-[1px] bg-border mx-2" />

        {/* Role Switcher (Keeping it accessible here too) */}
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
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px] h-9 text-sm border border-border bg-black/10 focus:outline-none focus:ring-1 focus:ring-orange/50"
          />
        </div>

        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-text-muted hover:text-text hover:bg-surface-2"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-orange animate-pulse" />
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-0 mr-4 bg-surface border-border"
            align="end"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h4 className="font-semibold text-text">Notifications</h4>
              <Link
                href="/notifications"
                className="text-xs text-orange hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.map((n, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-4 border-b border-border last:border-0 hover:bg-surface-2 transition-colors cursor-pointer",
                    !n.read && "bg-orange/5",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-1 h-2 w-2 rounded-full flex-shrink-0",
                        n.read ? "bg-transparent" : "bg-orange",
                      )}
                    />
                    <div>
                      <p
                        className={cn(
                          "text-sm",
                          n.read ? "text-text-muted" : "text-text font-medium",
                        )}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-text-dim mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage
                  src="/avatars/01.png"
                  alt={isVendor ? "Vendor" : "Admin"}
                />
                <AvatarFallback className="bg-orange/10 text-orange font-bold">
                  {isVendor ? "VN" : "AD"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-surface border-border text-text"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {isVendor ? "Restaurant Owner" : "Admin User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {isVendor ? "vendor@food.com" : "admin@food.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-red-500 hover:text-red-500 hover:bg-red-500/10 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
