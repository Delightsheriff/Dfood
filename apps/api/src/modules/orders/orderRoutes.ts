import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  cancelOrder,
  getOrderByNumber,
} from "./orderController";
import { protect } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createOrderSchema } from "./order";

const router = Router();

// All routes require authentication
router.post("/", protect, validate(createOrderSchema), createOrder);
router.get("/", protect, getMyOrders);
router.get("/number/:orderNumber", protect, getOrderByNumber);
router.get("/:id", protect, getOrderById);
router.patch("/:id/cancel", protect, cancelOrder);

export default router;
