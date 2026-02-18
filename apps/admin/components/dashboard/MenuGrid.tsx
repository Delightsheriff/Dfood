"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MenuGrid() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Jollof Rice",
      price: "₦2,500",
      status: "In stock",
      sold: 24,
      available: true,
      icon: "🍚",
    },
    {
      id: 2,
      name: "Fried Chicken",
      price: "₦3,200",
      status: "In stock",
      sold: 18,
      available: true,
      icon: "🍗",
    },
    {
      id: 3,
      name: "Egusi Soup",
      price: "₦4,000",
      status: "Out of stock",
      sold: 0,
      available: false,
      icon: "🥘",
    },
    {
      id: 4,
      name: "Pepperoni Pizza",
      price: "₦6,500",
      status: "In stock",
      sold: 12,
      available: true,
      icon: "🍕",
    },
    {
      id: 5,
      name: "Spaghetti",
      price: "₦2,800",
      status: "In stock",
      sold: 9,
      available: true,
      icon: "🍝",
    },
    {
      id: 6,
      name: "Caesar Salad",
      price: "₦3,500",
      status: "In stock",
      sold: 6,
      available: true,
      icon: "🥗",
    },
  ]);

  const toggleAvailability = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              available: !item.available,
              status: !item.available ? "In stock" : "Out of stock",
            }
          : item,
      ),
    );
  };

  return (
    <Card className="border-border bg-surface">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-text">Your Menu</CardTitle>
        <button className="text-sm font-semibold text-orange hover:opacity-80 transition-opacity">
          + Add Item
        </button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-border bg-black/20 hover:border-orange/50 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-orange/20 to-amber-500/20 text-6xl">
                {item.icon}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-text">{item.name}</h3>
                  <span className="font-mono font-bold text-orange">
                    {item.price}
                  </span>
                </div>
                <p className="text-xs text-text-muted mb-3">
                  {item.available
                    ? `In stock • ${item.sold} sold today`
                    : "Out of stock"}
                </p>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleAvailability(item.id)}
                >
                  <div
                    className={cn(
                      "relative h-6 w-10 rounded-full transition-colors",
                      item.available ? "bg-green-500" : "bg-border",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform",
                        item.available ? "translate-x-4" : "translate-x-0",
                      )}
                    />
                  </div>
                  <span className="text-xs font-semibold text-text-muted">
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
