import { Router } from "express";
import { vendorSignup } from "./vendorAuthController";
import { signupLimiter } from "../../middleware/rateLimiter";
import { validate } from "../../middleware/validate";
import { vendorSignupSchema } from "./vendorAuthTypes";

const router = Router();

router.post("/signup", signupLimiter, validate(vendorSignupSchema), vendorSignup);

export default router;
