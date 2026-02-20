import apiClient from "@/lib/api-client";

// ── Admin search result types ──────────────────────

export type SearchUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  type: "user";
};

export type SearchRestaurant = {
  _id: string;
  name: string;
  address: string;
  images: string[];
  type: "restaurant";
};

export type SearchOrder = {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  customerId?: { name: string; email: string };
  restaurantId?: { name: string };
  type: "order";
};

export type SearchFoodItem = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  restaurantId?: { name: string };
  type: "foodItem";
};

export type AdminSearchResults = {
  users: SearchUser[];
  restaurants: SearchRestaurant[];
  orders: SearchOrder[];
  foodItems: SearchFoodItem[];
};

export type VendorSearchResults = {
  orders: SearchOrder[];
  foodItems: SearchFoodItem[];
};

export type DashboardSearchResults = AdminSearchResults | VendorSearchResults;

// ── Service ────────────────────────────────────────

export const searchApi = {
  dashboardSearch: async (query: string) => {
    const { data } = await apiClient.get<{
      success: boolean;
      data: DashboardSearchResults;
    }>("/dashboard/search", { params: { q: query } });
    return data.data;
  },
};
