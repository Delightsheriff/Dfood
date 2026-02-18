"use client";

import { useDashboardRole } from "./DashboardRoleContext";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function RevenueChart() {
  const { isVendor } = useDashboardRole();

  const data = [
    { name: "Mon", total: 1200 },
    { name: "Tue", total: 2100 },
    { name: "Wed", total: 1800 },
    { name: "Thu", total: 2400 },
    { name: "Fri", total: 3200 },
    { name: "Sat", total: 3800 },
    { name: "Sun", total: 4200 },
  ];

  return (
    <Card className="col-span-4 border-border bg-surface md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-text">
          {isVendor ? "Sales Overview" : "Revenue Overview"}
        </CardTitle>
        <button className="flex items-center text-xs font-semibold text-orange hover:opacity-80 transition-opacity">
          View Report <ArrowRight className="ml-1 h-3 w-3" />
        </button>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7622" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff7622" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="#6b6b6b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b6b6b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₦${value}`}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#999" }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#ff7622"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
