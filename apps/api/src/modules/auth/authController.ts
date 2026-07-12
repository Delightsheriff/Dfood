import { Request, Response } from "express";
import { AuthService } from "./authService";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { UnauthorizedError } from "../../types/errors";
import { env } from "../../config/env";

const authService = new AuthService();

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await authService.signup(req.body);

  sendSuccess(res, { user, token }, undefined, 201);
});

export const createAdmin = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new UnauthorizedError("Authentication required");
  }

  const { user } = await authService.createAdmin(req.body, req.user._id.toString());

  sendSuccess(res, { user }, "Admin account created successfully", 201);
});

export const googleCallback = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError("Google authentication failed");
    }

    const { token } = await authService.googleAuth(req.user as any);

    const redirectUrl = `${env.CLIENT_URL}/auth/callback?token=${token}`;

    res.redirect(redirectUrl);
  },
);

export const signin = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await authService.signin(req.body);

  sendSuccess(res, { user, token });
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body);

    sendSuccess(res, null, "If email exists, OTP has been sent");
  },
);

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { resetToken } = await authService.verifyOTP(req.body);

  sendSuccess(res, { resetToken }, "OTP verified successfully");
});

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Reset token required");
    }

    const resetToken = authHeader.split(" ")[1]!;
    const userId = await authService.validateResetToken(resetToken);

    await authService.resetPassword(userId, req.body);

    sendSuccess(res, null, "Password reset successful");
  },
);

export const getSession = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required");
  }

  sendSuccess(res, {
    user: {
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});
