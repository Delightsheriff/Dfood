import { Router } from "express";
import {
  getProfile,
  updateProfile,
  updateProfileImage,
  deleteProfileImage,
} from "./profileController";
import { protect } from "../../middleware/auth";
import { uploadSingle } from "../../middleware/upload";
import { validate } from "../../middleware/validate";
import { updateProfileSchema } from "./profile";

const router = Router();

// All routes require authentication
router.get("/", protect, getProfile);
router.patch("/", protect, validate(updateProfileSchema), updateProfile);
router.post("/image", protect, uploadSingle, updateProfileImage);
router.delete("/image", protect, deleteProfileImage);

export default router;
