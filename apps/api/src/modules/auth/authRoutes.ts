import { Router } from "express";
import passport from "../../config/passport";
import {
  signup,
  createAdmin,
  signin,
  googleCallback,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getSession,
} from "./authController";
import { protect, restrictTo } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { authLimiter, forgotPasswordLimiter } from "../../middleware/rateLimiter";
import {
  signupSchema,
  signinSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordSchema,
} from "./authTypes";
import { UserRole } from "./authTypes";

const router = Router();

// Public routes
router.post("/signup", authLimiter, validate(signupSchema), signup);
router.post("/signin", authLimiter, validate(signinSchema), signin);
router.post("/forgot-password", forgotPasswordLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-otp", authLimiter, validate(verifyOTPSchema), verifyOTP);
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), resetPassword);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google/failure",
  }),
  googleCallback,
);

router.get("/google/failure", (_req, res) => {
  res.status(401).json({
    success: false,
    message: "Google authentication failed",
  });
});

// Protected routes
router.get("/session", protect, getSession);
router.post("/admin/create", protect, restrictTo(UserRole.ADMIN), validate(signupSchema), createAdmin);

export default router;
