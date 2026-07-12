import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import User from "../../models/User";
import { z } from "zod";
import { sendSuccess, sendError } from "../../utils/response";

export const registerTokenSchema = z.object({
  token: z.string().min(1, "Device token required"),
  platform: z.enum(["ios", "android"]),
});

export const registerDeviceToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token, platform } = req.body;

    const user = await User.findById(req.user!._id);
    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    // Check if token already exists
    const tokenExists = user.deviceTokens.some((dt) => dt.token === token);

    if (!tokenExists) {
      user.deviceTokens.push({ token, platform, addedAt: new Date() });
      await user.save({ validateModifiedOnly: true });
    }

    sendSuccess(res, undefined, "Device token registered successfully");
  },
);

export const unregisterDeviceToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    const user = await User.findById(req.user!._id);
    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    user.deviceTokens = user.deviceTokens.filter((dt) => dt.token !== token);
    await user.save({ validateModifiedOnly: true });

    sendSuccess(res, undefined, "Device token unregistered successfully");
  },
);
