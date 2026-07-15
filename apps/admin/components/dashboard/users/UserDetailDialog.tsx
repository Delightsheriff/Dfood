"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Phone, Calendar, History, ShieldAlert, Award } from "lucide-react";
import { formatDate, getInitials } from "@/lib/format";
import { UserRoleBadge } from "./UserRoleBadge";
import type { AdminUser, UserRole } from "@/services/users.service";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserDetailDialogProps {
  user: AdminUser | null;
  open: boolean;
  onClose: () => void;
  onRoleChange?: (userId: string, newRole: UserRole) => void;
}

export function UserDetailDialog({
  user,
  open,
  onClose,
  onRoleChange,
}: UserDetailDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer");

  // Sync state when dialog opens
  useState(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  });

  if (!user) return null;

  const handleRoleUpdate = () => {
    if (onRoleChange) {
      onRoleChange(user._id, selectedRole);
      toast.success(`Role updated to ${selectedRole}`);
    }
  };

  // Mock activity logs for the client
  const mockActivities = [
    { action: "Placed food order #ORD-2026-X8", time: "2026-07-15 11:20" },
    { action: "Updated profile details", time: "2026-07-14 09:05" },
    { action: "Verified mobile contact phone", time: "2026-07-10 14:30" },
    { action: "Registered account via client app", time: "2026-07-10 14:15" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border p-6 rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            User details profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-3.5 py-4">
          <Avatar className="h-16 w-16 border border-border">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-sm font-bold text-foreground">{user.name}</h3>
            <div className="mt-1">
              <UserRoleBadge role={user.role} />
            </div>
          </div>
        </div>

        {/* Profile details */}
        <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4 text-xs">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground font-semibold">Email</span>
            <span className="ml-auto text-foreground font-bold">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground font-semibold">Phone</span>
            <span className="ml-auto text-foreground font-bold">
              {user.phone || "—"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground font-semibold">Joined</span>
            <span className="ml-auto text-foreground font-bold">
              {formatDate(user.createdAt)}
            </span>
          </div>
        </div>

        {/* Role override controls */}
        <div className="border border-border/80 rounded-xl p-4 bg-muted/5 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Award className="h-4 w-4 text-primary" />
            Clearance Role Override
          </span>
          
          <div className="flex gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="flex-1 bg-background border border-border h-9 rounded-lg text-xs px-2 text-foreground"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor Partner</option>
              <option value="admin">Platform Admin</option>
            </select>
            
            <Button
              onClick={handleRoleUpdate}
              disabled={selectedRole === user.role}
              size="sm"
              className="h-9 px-4 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 rounded-lg shrink-0"
            >
              Save Role
            </Button>
          </div>
        </div>

        {/* Recent Activity timeline */}
        <div className="space-y-3.5 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <History className="h-4 w-4 text-primary" />
            Recent Activity Log
          </span>

          <div className="relative border-l border-border pl-4 space-y-4 pt-1">
            {mockActivities.map((act, idx) => (
              <div key={idx} className="relative text-[11px] leading-relaxed">
                <div className="absolute -left-[20.5px] top-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background border border-card" />
                <div className="flex justify-between items-start gap-2">
                  <span className="font-semibold text-foreground">{act.action}</span>
                  <span className="text-[9px] text-muted-foreground shrink-0">{act.time.split(" ")[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
