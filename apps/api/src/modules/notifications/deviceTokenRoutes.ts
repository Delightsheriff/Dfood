import { Router } from "express";
import {
  registerDeviceToken,
  unregisterDeviceToken,
  registerTokenSchema,
} from "./deviceTokenController";
import { protect } from "../../middleware/auth";
import { validate } from "../../middleware/validate";

const router = Router();

router.post("/register", protect, validate(registerTokenSchema), registerDeviceToken);
router.post("/unregister", protect, unregisterDeviceToken);

export default router;
