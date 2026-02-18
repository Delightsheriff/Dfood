"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UsersPage() {
  const users = [
    {
      name: "John Doe",
      email: "john@example.com",
      role: "Customer",
      join: "2 days ago",
    },
    {
      name: "Sarah Mike",
      email: "sarah@example.com",
      role: "Vendor",
      join: "5 days ago",
    },
    {
      name: "Tunde Ade",
      email: "tunde@example.com",
      role: "Customer",
      join: "1 week ago",
    },
    {
      name: "Femi Ojo",
      email: "femi@example.com",
      role: "Driver",
      join: "2 weeks ago",
    },
  ];

  return (
    <PageShell
      title="Users"
      action={
        <button className="text-orange font-semibold hover:underline">
          Export CSV
        </button>
      }
    >
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-text-muted">User</TableHead>
              <TableHead className="text-text-muted">Role</TableHead>
              <TableHead className="text-text-muted">Joined</TableHead>
              <TableHead className="text-right text-text-muted">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, i) => (
              <TableRow key={i} className="border-border hover:bg-surface-2">
                <TableCell className="font-medium text-text">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-orange/20 text-orange">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-xs text-text-muted">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-text">{user.role}</TableCell>
                <TableCell className="text-text-muted">{user.join}</TableCell>
                <TableCell className="text-right">
                  <button className="text-text-muted hover:text-white transition-colors">
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}
