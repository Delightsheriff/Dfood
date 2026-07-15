"use client";

import { UtensilsCrossed, User, Settings } from "lucide-react";
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
    link.roles.includes(role),
  );

  // Get user initials
  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  if (isLoading) {
    return null; // Or a skeleton loader
  }

  return (
    <Sidebar collapsible="icon" {...props} className="border-border">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <UtensilsCrossed className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-primary">DFOOD</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {roleLabels[role] || "Portal"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={link.label}
                      className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary transition-colors hover:bg-muted hover:text-primary"
                    >
                      <Link href={link.href}>
                        <link.icon className={cn(isActive && "text-primary")} />
                        <span className={cn(isActive && "font-bold")}>
                          {link.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link href="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ProfileDropdown>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.image || ""}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold font-mono">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name || "User"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email || ""}
                  </span>
                </div>
                <User className="ml-auto size-4" />
              </SidebarMenuButton>
            </ProfileDropdown>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
