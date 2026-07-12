// ── Response wrappers ─────────────────────────────────────────────

export type ErrorResponse = {
  success: false;
  message: string;
  errors?: string[];
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

// ── User / Auth ───────────────────────────────────────────────────

export type UserRole = "customer" | "vendor" | "admin";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
};

// ── Category ──────────────────────────────────────────────────────

export type Category = {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

// ── Restaurant ────────────────────────────────────────────────────

export type Restaurant = {
  _id: string;
  name: string;
  description?: string;
  address?: string;
  images: string[];
  deliveryFee: number;
  openingTime: string;
  closingTime: string;
  isOpen?: boolean;
  status?: "Open" | "Closed";
  rating: number;
  totalReviews: number;
  owner?: string;
  ownerId?: string;
  tags?: string[];
  isProfileComplete?: boolean;
  createdAt: string;
  updatedAt: string;
};

// ── FoodItem ──────────────────────────────────────────────────────

export type FoodItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  calories?: number;
  restaurantId: string | Restaurant;
  categoryIds?: string[];
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
};

// ── Order ─────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderItem = {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
};

export type Order = {
  _id: string;
  orderNumber: string;
  customerId:
    | string
    | {
        _id: string;
        name: string;
        email?: string;
        phone?: string;
        profileImage?: string;
      };
  restaurantId:
    | string
    | {
        _id: string;
        name: string;
        images: string[];
        address?: string;
        phone?: string;
      };
  items: OrderItem[];
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number };
  };
  paymentMethod: "cash" | "card";
  paymentStatus: PaymentStatus;
  paystackReference?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
};

// ── Address ───────────────────────────────────────────────────────

export type Address = {
  _id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  coordinates: { lat: number; lng: number };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

// ── PaymentMethod ─────────────────────────────────────────────────

export type PaymentMethod = {
  _id: string;
  userId?: string;
  type: "card" | "cash";
  cardLast4?: string;
  cardBrand?: string;
  cardExpMonth?: string;
  cardExpYear?: string;
  bank?: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// ── Notification ──────────────────────────────────────────────────

export type NotificationType =
  | "new_order"
  | "order_status"
  | "payment"
  | "system"
  | "review"
  | "promotion"
  | "new_user";

export type Notification = {
  _id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
};
