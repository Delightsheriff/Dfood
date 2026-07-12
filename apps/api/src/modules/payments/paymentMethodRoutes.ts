import { Router } from "express";
import {
  addCard,
  getAllPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  getDefaultPaymentMethod,
} from "./paymentMethodController";
import { protect } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { addCardSchema } from "./payment";

const router = Router();

// All routes require authentication
router.post("/card", protect, validate(addCardSchema), addCard);
router.get("/", protect, getAllPaymentMethods);
router.get("/default", protect, getDefaultPaymentMethod);
router.patch("/:id/default", protect, setDefaultPaymentMethod);
router.delete("/:id", protect, deletePaymentMethod);

export default router;
