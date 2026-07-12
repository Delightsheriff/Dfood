import { Router } from "express";
import { vendorSignup } from "./vendorAuthController";
import { signupLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/signup", signupLimiter, vendorSignup);

export default router;
