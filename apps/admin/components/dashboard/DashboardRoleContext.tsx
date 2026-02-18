"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Role = "admin" | "vendor";

interface DashboardRoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isVendor: boolean;
  isAdmin: boolean;
}

const DashboardRoleContext = createContext<
  DashboardRoleContextType | undefined
>(undefined);

export function DashboardRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("admin");

  const isVendor = role === "vendor";
  const isAdmin = role === "admin";

  return (
    <DashboardRoleContext.Provider value={{ role, setRole, isVendor, isAdmin }}>
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
