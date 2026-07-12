import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { vendorAuthService } from "./vendorAuthService";
import { vendorSignupSchema } from "./vendorAuthTypes";

export const vendorSignup = asyncHandler(
  async (req: Request, res: Response) => {
    const data = vendorSignupSchema.parse(req.body);

    const result = await vendorAuthService.createVendorWithRestaurant(data);

    res.status(201).json({
      success: true,
      data: result,
      message: "Vendor account created successfully",
    });
  },
);
