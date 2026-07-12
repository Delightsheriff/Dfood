import { Router } from "express";
import {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
  getDefaultAddress,
} from "./addressController";
import { protect } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createAddressSchema, updateAddressSchema } from "./address";

const router = Router();

// All routes require authentication
router.post("/", protect, validate(createAddressSchema), createAddress);
router.get("/", protect, getAllAddresses);
router.get("/default", protect, getDefaultAddress);
router.get("/:id", protect, getAddressById);
router.patch("/:id", protect, validate(updateAddressSchema), updateAddress);
router.patch("/:id/default", protect, setDefaultAddress);
router.delete("/:id", protect, deleteAddress);

export default router;
