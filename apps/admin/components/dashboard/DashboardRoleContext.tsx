"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export type Role =
  | "super_admin"
  | "manager"
  | "support"
  | "restaurant_admin"
  | "content_manager"
  | "finance";

interface DashboardRoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isSuperAdmin: boolean;
  isManager: boolean;
  isSupport: boolean;
  isRestaurantAdmin: boolean;
  isContentManager: boolean;
  isFinance: boolean;
  isVendor: boolean; // Backwards compatibility helper (mapped to restaurant_admin)
  isAdmin: boolean;  // Backwards compatibility helper (mapped to super_admin)
  isLoading: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role: string;
  } | null;
}

const DashboardRoleContext = createContext<
  DashboardRoleContextType | undefined
>(undefined);

export function DashboardRoleProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [simulatedRole, setSimulatedRole] = useState<Role | null>(null);

  // Load simulated role from localStorage on mount (client-side only)
  useEffect(() => {
    const saved = localStorage.getItem("dfood_simulated_role") as Role;
    if (saved) {
      setSimulatedRole(saved);
    }
  }, []);

  const changeRole = (newRole: Role) => {
    setSimulatedRole(newRole);
    localStorage.setItem("dfood_simulated_role", newRole);
  };

  const isLoading = status === "loading";
  const user = session?.user ?? null;

  // Resolve active role (simulated has priority, then session mapped, default to restaurant_admin)
  let resolvedRole: Role = "restaurant_admin";
  if (simulatedRole) {
    resolvedRole = simulatedRole;
  } else if (user?.role) {
    const sessionRole = user.role.toLowerCase();
    if (sessionRole === "admin" || sessionRole === "super_admin") {
      resolvedRole = "super_admin";
    } else if (sessionRole === "vendor" || sessionRole === "restaurant_admin") {
      resolvedRole = "restaurant_admin";
    } else if (
      ["manager", "support", "content_manager", "finance"].includes(sessionRole)
    ) {
      resolvedRole = sessionRole as Role;
    }
  }

  const isSuperAdmin = resolvedRole === "super_admin";
  const isManager = resolvedRole === "manager";
  const isSupport = resolvedRole === "support";
  const isRestaurantAdmin = resolvedRole === "restaurant_admin";
  const isContentManager = resolvedRole === "content_manager";
  const isFinance = resolvedRole === "finance";

  // Mappings for older V1 templates to prevent page crashes
  const isAdmin = isSuperAdmin;
  const isVendor = isRestaurantAdmin;

  return (
    <DashboardRoleContext.Provider
      value={{
        role: resolvedRole,
        setRole: changeRole,
        isSuperAdmin,
        isManager,
        isSupport,
        isRestaurantAdmin,
        isContentManager,
        isFinance,
        isVendor,
        isAdmin,
        isLoading,
        user,
      }}
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

