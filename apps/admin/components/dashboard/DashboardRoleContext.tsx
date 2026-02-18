"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";

type Role = "admin" | "vendor";

interface DashboardRoleContextType {
  role: Role;
  isVendor: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
}

const DashboardRoleContext = createContext<
  DashboardRoleContextType | undefined
>(undefined);

export function DashboardRoleProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const user = session?.user ?? null;
  const role = (user?.role as Role) ?? "vendor"; // Default to vendor

  const isVendor = role === "vendor";
  const isAdmin = role === "admin";

  return (
    <DashboardRoleContext.Provider
      value={{ role, isVendor, isAdmin, isLoading, user }}
    >
      {children}
    </DashboardRoleContext.Provider>
  );
}

export function useDashboardRole() {
  const context = useContext(DashboardRoleContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardRole must be used within a DashboardRoleProvider",
    );
  }
  return context;
}
