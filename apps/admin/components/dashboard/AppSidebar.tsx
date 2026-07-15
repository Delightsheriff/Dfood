"use client";

import { UtensilsCrossed, User, Settings, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDashboardRole, Role } from "./DashboardRoleContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navigationLinks } from "@/types/links";
import { ProfileDropdown } from "./ProfileDropdown";

const roleLabels: Record<Role, string> = {
  super_admin: "Platform Owner",
  manager: "Operations Manager",
  support: "Customer Support",
  restaurant_admin: "Restaurant Admin",
  content_manager: "Catalog Editor",
  finance: "Financial Auditor",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role, user, isLoading } = useDashboardRole();
  const pathname = usePathname();

  // Filter links based on current role
  const visibleLinks = navigationLinks.filter((link) =>
    link.roles.includes(role)
  );

  // Group links logically into enterprise categories
  const groupedMenus = [
    {
      label: "Operations",
      items: visibleLinks.filter((l) => ["/dashboard", "/orders"].includes(l.href)),
    },
    {
      label: "Directory",
      items: visibleLinks.filter((l) => ["/restaurants", "/categories", "/menu"].includes(l.href)),
    },
    {
      label: "Marketing & Reviews",
      items: visibleLinks.filter((l) => ["/users", "/promotions", "/reviews"].includes(l.href)),
    },
    {
      label: "Administration",
      items: visibleLinks.filter((l) => ["/financials", "/media", "/logs", "/reports"].includes(l.href)),
    },
  ];

  // Get user initials
  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  if (isLoading) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-border/80 bg-card">
      <SidebarHeader className="border-b border-border/40 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <UtensilsCrossed className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bebas text-lg tracking-[1.5px] text-primary">DFOOD</span>
                  <span className="truncate text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    {roleLabels[role] || "Portal"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-4">
        {groupedMenus.map((group) => {
          // Hide groups that don't have any visible links for this role
          if (group.items.length === 0) return null;

          return (
            <SidebarGroup key={group.label} className="mb-4">
              <SidebarGroupLabel className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3.5 mb-2">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="px-2 space-y-1">
                  {group.items.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <SidebarMenuItem key={link.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={link.label}
                          className={cn(
                            "h-9 text-xs font-semibold rounded-lg transition-all duration-200 px-3 flex items-center gap-3 relative",
                            isActive
                              ? "bg-primary/10 text-primary border border-primary/15 shadow-sm"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Link href={link.href}>
                            <link.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground/80")} />
                            <span className="flex-1">{link.label}</span>
                            {isActive && (
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-3 rounded-full bg-primary" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}

        <SidebarSeparator className="my-2 bg-border/40" />

        <SidebarGroup className="px-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Settings"
                className={cn(
                  "h-9 text-xs font-semibold rounded-lg transition-all duration-200 px-3",
                  pathname === "/settings"
                    ? "bg-primary/10 text-primary border border-primary/15"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Link href="/settings">
                  <Settings className="h-4 w-4 shrink-0" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <ProfileDropdown>
              <SidebarMenuButton
                size="lg"
                className="w-full flex items-center gap-3 p-2 rounded-xl border border-border/20 bg-background/50 hover:bg-muted/50 transition-all duration-300"
              >
                <Avatar className="h-8 w-8 rounded-lg border border-border/40">
                  <AvatarImage
                    src={user?.image || ""}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="rounded-lg bg-primary/15 text-primary font-bold text-xs font-mono">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-bold text-foreground">
                    {user?.name || "Operations Admin"}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground flex items-center gap-1 font-medium mt-0.5">
                    <Shield className="h-3 w-3 text-primary shrink-0" />
                    {roleLabels[role] || "Portal"}
                  </span>
                </div>
              </SidebarMenuButton>
            </ProfileDropdown>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
