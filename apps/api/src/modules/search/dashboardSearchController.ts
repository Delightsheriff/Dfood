import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { dashboardSearchService } from "./dashboardSearchService";
import { sendSuccess } from "../../utils/response";
import { ValidationError } from "../../types/errors";
import { UserRole } from "../../types/auth";

export const dashboardSearch = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query.q as string;

    if (!query || query.trim().length < 2) {
      throw new ValidationError("Search query must be at least 2 characters");
    }

    const userRole = req.user!.role;
    let results;

    if (userRole === UserRole.ADMIN) {
      results = await dashboardSearchService.adminSearch(query);
    } else if (userRole === UserRole.VENDOR) {
      results = await dashboardSearchService.vendorSearch(
        req.user!._id.toString(),
        query,
      );
    } else {
      throw new ValidationError("Unauthorized");
    }

    sendSuccess(res, results);
  },
);
