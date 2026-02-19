"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsPopover } from "./NotificationsPopover";
import { SearchDialog } from "./SearchDialog";

export function Header() {
  return (
    <header className="glass sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4 shadow-sm z-10 transition-all">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-text hover:bg-surface-2 hover:text-orange" />
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <SearchDialog />
        </div>

        <div className="flex items-center gap-2">
          <NotificationsPopover />
        </div>
      </div>
    </header>
  );
}
