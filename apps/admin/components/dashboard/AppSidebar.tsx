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
import { useDashboardRole } from "./DashboardRoleContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navigationLinks } from "@/types/links";
import { ProfileDropdown } from "./ProfileDropdown";

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
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange text-white">
                  <UtensilsCrossed className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-orange">FOOD</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {role === "vendor" ? "Vendor Portal" : "Admin Portal"}
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
                      className="data-[active=true]:bg-orange/10 data-[active=true]:text-orange transition-colors hover:bg-surface-2 hover:text-orange"
                    >
                      <Link href={link.href}>
                        <link.icon className={cn(isActive && "text-orange")} />
                        <span className={cn(isActive && "font-bold")}>
                          {link.label}
                        </span>
                        {link.badge && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-white">
                            {link.badge}
                          </span>
                        )}
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
                  <AvatarFallback className="rounded-lg bg-orange/10 text-orange font-bold font-mono">
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
