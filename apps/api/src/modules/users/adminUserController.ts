import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { adminUserService } from "./adminUserService";
import { sendSuccess } from "../../utils/response";
import { NotFoundError } from "../../types/errors";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { role, search } = req.query;

  const users = await adminUserService.getAllUsers({
    role: role as any,
    search: search as string,
  });

  sendSuccess(res, { users });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await adminUserService.getUserById(req.params.id as string);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  sendSuccess(res, { user });
});

export const getUserStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await adminUserService.getUserStats();

    sendSuccess(res, stats);
  },
);
