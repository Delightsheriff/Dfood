import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./categoryController";
import { protect, restrictTo } from "../../middleware/auth";
import { uploadSingle } from "../../middleware/upload";
import { UserRole } from "../../types/auth";
import { validate } from "../../middleware/validate";
import { createCategorySchema, updateCategorySchema } from "./category";

const router = Router();

// Public routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin-only routes
router.post(
  "/",
  protect,
  restrictTo(UserRole.ADMIN),
  uploadSingle,
  validate(createCategorySchema),
  createCategory,
);

router.patch(
  "/:id",
  protect,
  restrictTo(UserRole.ADMIN),
  uploadSingle,
  validate(updateCategorySchema),
  updateCategory,
);

router.delete("/:id", protect, restrictTo(UserRole.ADMIN), deleteCategory);

export default router;
