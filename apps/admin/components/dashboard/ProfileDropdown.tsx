"use client";

import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDashboardRole } from "./DashboardRoleContext";
import { signOut } from "next-auth/react";
import { clearTokenCache } from "@/lib/api-client";

export function ProfileDropdown({ children }: { children?: React.ReactNode }) {
  const { isVendor, user } = useDashboardRole();

  const handleLogout = async () => {
    clearTokenCache(); // Clear axios token cache
    await signOut({ callbackUrl: "/login" });
  };

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children || (
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-orange/10 font-bold text-orange">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="glass w-56 border-border text-text"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name || (isVendor ? "Restaurant Owner" : "Admin User")}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || (isVendor ? "vendor@food.com" : "admin@food.com")}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="cursor-pointer focus:bg-surface-2 focus:text-text"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="cursor-pointer focus:bg-surface-2 focus:text-text"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-500 hover:bg-red-500/10 hover:text-red-500 focus:bg-red-500/10 focus:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
