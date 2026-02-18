"use client";

import { SidebarContent } from "./SidebarContent";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface MobileSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function MobileSidebar({ open, setOpen }: MobileSidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/80 transition-opacity md:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-surface transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="absolute right-4 top-4 z-50">
          <button
            onClick={() => setOpen(false)}
            className="text-text-muted hover:text-text"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <SidebarContent onLinkClick={() => setOpen(false)} />
      </div>
    </>
  );
}
