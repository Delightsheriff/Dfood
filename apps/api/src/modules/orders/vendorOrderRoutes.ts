import { Router } from "express";
import {
  getRestaurantOrders,
  getVendorOrderById,
  updateOrderStatus,
  getVendorOrderStats,
} from "./vendorOrderController";
import { protect, restrictTo } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { updateStatusSchema } from "./order";
import { UserRole } from "../../types/auth";

const router = Router();

// All routes require vendor role
router.get("/", protect, restrictTo(UserRole.VENDOR), getRestaurantOrders);
router.get("/stats", protect, restrictTo(UserRole.VENDOR), getVendorOrderStats);
router.get("/:id", protect, restrictTo(UserRole.VENDOR), getVendorOrderById);
router.patch(
  "/:id/status",
  protect,
  restrictTo(UserRole.VENDOR),
  validate(updateStatusSchema),
  updateOrderStatus,
);

export default router;
