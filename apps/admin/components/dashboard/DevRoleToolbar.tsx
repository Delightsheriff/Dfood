"use client";

import React, { useState, useEffect } from "react";
import { useDashboardRole, Role } from "./DashboardRoleContext";
import { Settings, Shield, User, Landmark, HelpCircle, Briefcase, Eye } from "lucide-react";

export function DevRoleToolbar() {
  const { role, setRole } = useDashboardRole();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render in development mode on client side
  if (!mounted || process.env.NODE_ENV !== "development") {
    return null;
  }

  const roles: { value: Role; label: string; icon: React.ReactNode; color: string }[] = [
    {
      value: "super_admin",
      label: "Super Admin",
      icon: <Shield className="w-4 h-4" />,
      color: "text-destructive border-red-500/20 bg-destructive/5",
    },
    {
      value: "manager",
      label: "Manager",
      icon: <Briefcase className="w-4 h-4" />,
      color: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    },
    {
      value: "support",
      label: "Support",
      icon: <HelpCircle className="w-4 h-4" />,
      color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    },
    {
      value: "restaurant_admin",
      label: "Restaurant Admin",
      icon: <User className="w-4 h-4" />,
      color: "text-primary-400 border-primary-500/20 bg-primary-500/5",
    },
    {
      value: "content_manager",
      label: "Content Manager",
      icon: <Eye className="w-4 h-4" />,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    },
    {
      value: "finance",
      label: "Finance",
      icon: <Landmark className="w-4 h-4" />,
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    },
  ];

  const currentRoleInfo = roles.find((r) => r.value === role) || roles[3]!;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 w-56 rounded-2xl border border-white/10 bg-black/80 p-2 backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-zinc-500">
            Simulate Role
          </div>
          <div className="h-px bg-white/5 my-1" />
          <div className="space-y-1">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => {
                  setRole(r.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium border transition-all duration-200 ${
                  role === r.value
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                <span className={role === r.value ? "text-primary" : "text-zinc-500"}>
                  {r.icon}
                </span>
                <span className="flex-1 text-left">{r.label}</span>
                {role === r.value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2.5 text-xs font-semibold backdrop-blur-md transition-all duration-300 shadow-lg ${currentRoleInfo.color} hover:bg-black/80 hover:border-white/20`}
      >
        <Settings className="w-3.5 h-3.5 animate-spin-slow" />
        <span className="tracking-wide">Dev Mode:</span>
        <span className="font-bold flex items-center gap-1.5">
          {currentRoleInfo.icon}
          {currentRoleInfo.label}
        </span>
      </button>
    </div>
  );
}
