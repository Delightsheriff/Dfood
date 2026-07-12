import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/authRoutes";
import categoryRoutes from "./modules/menu/categoryRoutes";
import restaurantRoutes from "./modules/restaurants/restaurantRoutes";
import foodItemRoutes from "./modules/menu/foodItemRoutes";
import searchRoutes from "./modules/search/searchRoutes";
import profileRoutes from "./modules/users/profileRoutes";
import favoriteRoutes from "./modules/favorites/favoriteRoutes";
import addressRoutes from "./modules/address/addressRoutes";
import paymentMethodRoutes from "./modules/payments/paymentMethodRoutes";
import orderRoutes from "./modules/orders/orderRoutes";
import vendorAuthRoutes from "./modules/auth/vendorAuthRoutes";
import adminUserRoutes from "./modules/users/adminUserRoutes";
import dashboardSearchRoutes from "./modules/search/dashboardSearchRoutes";
import adminOrderRoutes from "./modules/orders/adminOrderRoutes";
import vendorOrderRoutes from "./modules/orders/vendorOrderRoutes";
import vendorAnalyticsRoutes from "./modules/analytics/vendorAnalyticsRoutes";
import adminAnalyticsRoutes from "./modules/analytics/adminAnalyticsRoutes";
import notificationRoutes from "./modules/notifications/notificationRoutes";
import deviceTokenRoutes from "./modules/notifications/deviceTokenRoutes";

import { errorHandler } from "./middleware/errorHandler";
import passport from "./config/passport";

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(passport.initialize());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/vendor", vendorAuthRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/food-items", foodItemRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/dashboard/search", dashboardSearchRoutes);
app.use("/api/vendor/orders", vendorOrderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/vendor/analytics", vendorAnalyticsRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/device-tokens", deviceTokenRoutes);

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use(errorHandler);

export default app;
