import { Router } from "express";
import { getAdminAnalytics } from "./adminAnalyticsController";
import { protect, restrictTo } from "../../middleware/auth";
import { UserRole } from "../../types/auth";

const router = Router();

router.get("/", protect, restrictTo(UserRole.ADMIN), getAdminAnalytics);

export default router;
