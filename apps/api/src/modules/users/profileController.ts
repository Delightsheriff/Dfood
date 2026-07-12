import { Request, Response } from "express";
import { profileService } from "./profileService";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { ValidationError } from "../../types/errors";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await profileService.getProfile(req.user!._id.toString());

  sendSuccess(res, { profile });
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const profile = await profileService.updateProfile(
      req.user!._id.toString(),
      data,
    );

    sendSuccess(res, { profile });
  },
);

export const updateProfileImage = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ValidationError("Profile image is required");
    }

    const profile = await profileService.updateProfileImage(
      req.user!._id.toString(),
      req.file.buffer,
    );

    sendSuccess(res, { profile });
  },
);

export const deleteProfileImage = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await profileService.deleteProfileImage(
      req.user!._id.toString(),
    );

    sendSuccess(res, { profile });
  },
);
