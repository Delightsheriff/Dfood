"use client";

import { useDashboardRole } from "./DashboardRoleContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Order = {
  id: string;
  customer: string;
  initials: string;
  total: string;
  status: string;
  time: string;
  restaurant?: string;
};

export function OrdersTable() {
  const { isVendor } = useDashboardRole();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "confirmed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "preparing":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100";
      case "out for delivery":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const adminOrders: Order[] = [
    {
      id: "#ORD-2408",
      customer: "John Doe",
      initials: "JD",
      restaurant: "KFC Lekki",
      total: "₦4,200",
      status: "Pending",
      time: "2 mins ago",
    },
    {
      id: "#ORD-2407",
      customer: "Sarah Mike",
      initials: "SM",
      restaurant: "Dominos Pizza",
      total: "₦8,500",
      status: "Confirmed",
      time: "15 mins ago",
    },
    {
      id: "#ORD-2406",
      customer: "Tunde Ade",
      initials: "TA",
      restaurant: "Mama Cass",
      total: "₦3,800",
      status: "Preparing",
      time: "22 mins ago",
    },
    {
      id: "#ORD-2405",
      customer: "Femi Ojo",
      initials: "FO",
      restaurant: "Chicken Republic",
      total: "₦2,500",
      status: "Out for Delivery",
      time: "45 mins ago",
    },
    {
      id: "#ORD-2404",
      customer: "Ade Kunle",
      initials: "AK",
      restaurant: "Sweet Sensation",
      total: "₦5,200",
      status: "Delivered",
      time: "1 hour ago",
    },
  ];

  const vendorOrders: Order[] = [
    {
      id: "#ORD-2401",
      customer: "Chidi Mike",
      initials: "CM",
      total: "₦6,800",
      status: "Pending",
      time: "3 mins ago",
    },
    {
      id: "#ORD-2400",
      customer: "Bola Bello",
      initials: "BB",
      total: "₦4,200",
      status: "Confirmed",
      time: "18 mins ago",
    },
    {
      id: "#ORD-2399",
      customer: "Ngozi Eze",
      initials: "NE",
      total: "₦3,500",
      status: "Preparing",
      time: "32 mins ago",
    },
    {
      id: "#ORD-2398",
      customer: "Yemi Ade",
      initials: "YA",
      total: "₦7,900",
      status: "Delivered",
      time: "1 hour ago",
    },
  ];

  const orders = isVendor ? vendorOrders : adminOrders;

  return (
    <Card className="border-border bg-surface">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-text">
          Recent Orders
        </CardTitle>
        <button className="text-sm font-semibold text-orange hover:opacity-80 transition-opacity">
          Export CSV →
        </button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider font-mono text-text-muted">
                  Order ID
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-mono text-text-muted">
                  Customer
                </TableHead>
                {!isVendor && (
                  <TableHead className="text-xs uppercase tracking-wider font-mono text-text-muted">
                    Restaurant
                  </TableHead>
                )}
                <TableHead className="text-xs uppercase tracking-wider font-mono text-text-muted">
                  Total
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-mono text-text-muted">
                  Status
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-mono text-text-muted">
                  Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-border hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  <TableCell className="font-mono font-semibold text-text">
                    {order.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500">
                        <AvatarFallback className="bg-transparent text-white text-xs font-bold">
                          {order.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-text">
                        {order.customer}
                      </span>
                    </div>
                  </TableCell>
                  {!isVendor && (
                    <TableCell className="text-text">
                      {order.restaurant}
                    </TableCell>
                  )}
                  <TableCell className="font-mono font-medium text-text">
                    {order.total}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "font-mono font-medium rounded-full px-3",
                        getStatusColor(order.status),
                      )}
                    >
                      {order.status === "Pending" && (
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-text-muted font-mono">
                    {order.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
