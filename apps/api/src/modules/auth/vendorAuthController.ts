import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { vendorAuthService } from "./vendorAuthService";
import { sendSuccess } from "../../utils/response";

export const vendorSignup = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await vendorAuthService.createVendorWithRestaurant(req.body);

    sendSuccess(res, result, "Vendor account created successfully", 201);
  },
);
