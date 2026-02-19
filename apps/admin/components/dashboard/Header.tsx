"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function Header() {
  const { toggleSidebar } = useSidebar();
  const { data: user } = useUserProfile();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const handleLogout = () => {
    router.push("/auth/signin");
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden text-text hover:bg-surface-2"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(true)}
          className="text-text hover:bg-surface-2"
        >
          <Search className="h-5 w-5" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-text hover:bg-surface-2"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-surface border-border" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none text-text">
                  Notifications
                </h4>
                <p className="text-sm text-text-muted">
                  You have 3 unread messages.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center gap-4 rounded-md border border-border p-3 hover:bg-surface-2 transition-colors cursor-pointer">
                  <Bell className="mt-px h-5 w-5 text-orange" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-text">
                      New Order Received
                    </p>
                    <p className="text-xs text-text-muted">2 mins ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-md border border-border p-3 hover:bg-surface-2 transition-colors cursor-pointer">
                  <Bell className="mt-px h-5 w-5 text-orange" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-text">
                      System Update
                    </p>
                    <p className="text-xs text-text-muted">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={user?.profileImage} alt={user?.name} />
                <AvatarFallback className="bg-orange/10 text-orange font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-surface border-border"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-text">
                  {user?.name}
                </p>
                <p className="text-xs leading-none text-text-muted">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="text-text hover:bg-surface-2 cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-text hover:bg-surface-2 cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="text-red-500 hover:bg-red-50 cursor-pointer"
              onClick={handleLogout}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[500px] bg-surface border-border p-0 gap-0">
          <div className="flex items-center border-b border-border px-4">
            <Search className="mr-2 h-5 w-5 text-text-muted" />
            <Input
              placeholder="Type a command or search..."
              className="flex-1 border-none bg-transparent py-4 text-base shadow-none focus-visible:ring-0 placeholder:text-text-dim text-text"
            />
          </div>
          <div className="p-4 text-center text-sm text-text-muted">
            No results found.
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
