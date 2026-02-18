import React from "react";
import { DashboardRoleProvider } from "@/components/dashboard/DashboardRoleContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardRoleProvider>
      <div className="flex h-screen bg-black text-text font-sans">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-black p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardRoleProvider>
  );
}
