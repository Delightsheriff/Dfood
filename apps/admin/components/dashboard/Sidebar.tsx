"use client";

import { SidebarContent } from "./SidebarContent";

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r border-border bg-surface text-text md:flex">
      <SidebarContent />
    </aside>
  );
}
