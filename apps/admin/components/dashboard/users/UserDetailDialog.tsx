"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Phone, Calendar } from "lucide-react";
import { formatDate, getInitials } from "@/lib/format";
import { UserRoleBadge } from "./UserRoleBadge";
import type { AdminUser } from "@/services/users.service";

interface UserDetailDialogProps {
  user: AdminUser | null;
  open: boolean;
  onClose: () => void;
}

export function UserDetailDialog({
  user,
  open,
  onClose,
}: UserDetailDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">User Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
            <UserRoleBadge role={user.role} />
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-muted p-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email</span>
            <span className="ml-auto text-foreground font-medium">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Phone</span>
              <span className="ml-auto text-foreground font-medium">
                {user.phone}
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Joined</span>
            <span className="ml-auto text-foreground font-medium">
              {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
