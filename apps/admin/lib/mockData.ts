import { AdminAnalytics, VendorAnalytics } from "@/services/analytics.service";

// Helper to generate date strings
const getPastDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0]!;
};

export const mockAdminAnalytics: AdminAnalytics = {
  summary: {
    totalRevenue: 5420450,
    totalOrders: 1420,
    totalUsers: 852,
    newUsers: 142,
    activeRestaurants: 32,
    averageOrderValue: 3817.2,
    revenueChange: 18.5,
    ordersChange: 12.3,
    usersChange: 8.2,
  },
  revenueTrend: [
    { date: getPastDate(6), revenue: 650000 },
    { date: getPastDate(5), revenue: 780000 },
    { date: getPastDate(4), revenue: 710000 },
    { date: getPastDate(3), revenue: 890000 },
    { date: getPastDate(2), revenue: 920000 },
    { date: getPastDate(1), revenue: 1040000 },
    { date: getPastDate(0), revenue: 1200000 },
  ],
  orderTrend: [
    { date: getPastDate(6), orders: 180 },
    { date: getPastDate(5), orders: 210 },
    { date: getPastDate(4), orders: 195 },
    { date: getPastDate(3), orders: 240 },
    { date: getPastDate(2), orders: 250 },
    { date: getPastDate(1), orders: 280 },
    { date: getPastDate(0), orders: 310 },
  ],
  userGrowth: [
    { date: getPastDate(6), customers: 680, vendors: 28, total: 708 },
    { date: getPastDate(5), customers: 700, vendors: 29, total: 729 },
    { date: getPastDate(4), customers: 720, vendors: 29, total: 749 },
    { date: getPastDate(3), customers: 750, vendors: 30, total: 780 },
    { date: getPastDate(2), customers: 780, vendors: 30, total: 810 },
    { date: getPastDate(1), customers: 810, vendors: 31, total: 841 },
    { date: getPastDate(0), customers: 820, vendors: 32, total: 852 },
  ],
  restaurantPerformance: [
    { restaurantId: "r1", restaurantName: "Mega Chicken", orderCount: 420, revenue: 1850000, averageOrderValue: 4404.7 },
    { restaurantId: "r2", restaurantName: "Chicken Republic", orderCount: 380, revenue: 1240000, averageOrderValue: 3263.1 },
    { restaurantId: "r3", restaurantName: "The Place", orderCount: 290, revenue: 980000, averageOrderValue: 3379.3 },
    { restaurantId: "r4", restaurantName: "Sweet Sensation", orderCount: 180, revenue: 650000, averageOrderValue: 3611.1 },
    { restaurantId: "r5", restaurantName: "Mr Bigg's", orderCount: 150, revenue: 700450, averageOrderValue: 4669.6 },
  ],
  topRestaurants: [
    { restaurantId: "r1", restaurantName: "Mega Chicken", orderCount: 420, revenue: 1850000 },
    { restaurantId: "r2", restaurantName: "Chicken Republic", orderCount: 380, revenue: 1240000 },
    { restaurantId: "r3", restaurantName: "The Place", orderCount: 290, revenue: 980000 },
  ],
  categoryPerformance: [
    { categoryId: "c1", categoryName: "Fast Food", orderCount: 680, revenue: 2450000 },
    { categoryId: "c2", categoryName: "Traditional", orderCount: 340, revenue: 1520000 },
    { categoryId: "c3", categoryName: "Drinks", orderCount: 210, revenue: 450000 },
    { categoryId: "c4", categoryName: "Dessert", orderCount: 190, revenue: 1000450 },
  ],
  statusBreakdown: [
    { status: "pending", count: 12 },
    { status: "preparing", count: 18 },
    { status: "out_for_delivery", count: 15 },
    { status: "delivered", count: 1320 },
    { status: "cancelled", count: 55 },
  ],
};

export const mockVendorAnalytics: VendorAnalytics = {
  summary: {
    totalRevenue: 1850000,
    totalOrders: 420,
    averageOrderValue: 4404.7,
    revenueChange: 22.4,
    ordersChange: 15.1,
  },
  revenueTrend: [
    { date: getPastDate(6), revenue: 210000 },
    { date: getPastDate(5), revenue: 250000 },
    { date: getPastDate(4), revenue: 230000 },
    { date: getPastDate(3), revenue: 290000 },
    { date: getPastDate(2), revenue: 270000 },
    { date: getPastDate(1), revenue: 320000 },
    { date: getPastDate(0), revenue: 350000 },
  ],
  orderTrend: [
    { date: getPastDate(6), orders: 48 },
    { date: getPastDate(5), orders: 56 },
    { date: getPastDate(4), orders: 52 },
    { date: getPastDate(3), orders: 65 },
    { date: getPastDate(2), orders: 60 },
    { date: getPastDate(1), orders: 72 },
    { date: getPastDate(0), orders: 80 },
  ],
  statusBreakdown: [
    { status: "pending", count: 3 },
    { status: "preparing", count: 5 },
    { status: "out_for_delivery", count: 4 },
    { status: "delivered", count: 395 },
    { status: "cancelled", count: 13 },
  ],
  popularItems: [
    { foodItemId: "f1", name: "Jollof Rice with Chicken", orders: 185, revenue: 555000 },
    { foodItemId: "f2", name: "Fried Rice & Beef", orders: 120, revenue: 420000 },
    { foodItemId: "f3", name: "Spaghetti Bolognese", orders: 75, revenue: 315000 },
    { foodItemId: "f4", name: "Chicken Shawarma", orders: 40, revenue: 120000 },
  ],
};

// Reusable mock stats for general dashboard grid
export const mockOrderStats = (isVendor: boolean) => ({
  revenue: {
    total: isVendor ? 1850000 : 5420450,
    today: isVendor ? 85000 : 255000,
    thisMonth: isVendor ? 680000 : 1950000,
    thisWeek: isVendor ? 220000 : 640000,
  },
  orders: {
    total: isVendor ? 420 : 1420,
    today: isVendor ? 22 : 68,
    thisMonth: isVendor ? 160 : 480,
    thisWeek: isVendor ? 52 : 155,
  },
  statusBreakdown: {
    pending: isVendor ? 3 : 12,
    confirmed: isVendor ? 2 : 8,
    preparing: isVendor ? 5 : 18,
    out_for_delivery: isVendor ? 4 : 15,
    delivered: isVendor ? 395 : 1320,
    cancelled: isVendor ? 13 : 55,
  },
  topRestaurants: isVendor
    ? []
    : [
        { restaurantId: "r1", restaurantName: "Mega Chicken", orderCount: 420, revenue: 1850000 },
        { restaurantId: "r2", restaurantName: "Chicken Republic", orderCount: 380, revenue: 1240000 },
        { restaurantId: "r3", restaurantName: "The Place", orderCount: 290, revenue: 980000 },
      ],
});
