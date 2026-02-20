import React from "react";
import { DashboardRoleProvider } from "@/components/dashboard/DashboardRoleContext";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Header } from "@/components/dashboard/Header";
import { RestaurantCompletionBanner } from "@/components/dashboard/RestaurantCompletionBanner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardRoleProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-black">
          <Header />
          <main className="flex-1 overflow-y-auto bg-black p-4 md:p-8 pt-6">
            <RestaurantCompletionBanner />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardRoleProvider>
  );
}
