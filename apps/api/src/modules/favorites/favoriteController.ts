import { Request, Response } from "express";
import { favoriteService } from "./favoriteService";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";

export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  await favoriteService.addFavorite(
    req.user!._id.toString(),
    req.params.foodItemId as string,
  );

  sendSuccess(res, undefined, "Food item added to favorites", 201);
});

export const removeFavorite = asyncHandler(
  async (req: Request, res: Response) => {
    await favoriteService.removeFavorite(
      req.user!._id.toString(),
      req.params.foodItemId as string,
    );

    sendSuccess(res, undefined, "Food item removed from favorites");
  },
);

export const getFavorites = asyncHandler(
  async (req: Request, res: Response) => {
    const favorites = await favoriteService.getFavorites(
      req.user!._id.toString(),
    );

    sendSuccess(res, { favorites });
  },
);

export const checkIsFavorite = asyncHandler(
  async (req: Request, res: Response) => {
    const isFavorite = await favoriteService.checkIsFavorite(
      req.user!._id.toString(),
      req.params.foodItemId as string,
    );

    sendSuccess(res, { isFavorite });
  },
);
