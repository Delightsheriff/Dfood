import { Request, Response } from "express";
import { foodItemService } from "./foodItemService";
import { asyncHandler } from "../../utils/asyncHandler";
import { ValidationError } from "../../types/errors";
import { sendSuccess } from "../../utils/response";

export const createFoodItem = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Creating food item with data:", req.body);
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new ValidationError("At least one food image is required");
    }

    const imageBuffers = files.map((f) => f.buffer);

    const foodItem = await foodItemService.create(
      req.user!._id.toString(),
      req.body,
      imageBuffers,
    );

    sendSuccess(res, { foodItem }, undefined, 201);
  },
);

export const getFoodItemById = asyncHandler(
  async (req: Request, res: Response) => {
    const foodItem = await foodItemService.getById(req.params.id as string);

    sendSuccess(res, { foodItem });
  },
);

export const getMyFoodItems = asyncHandler(
  async (req: Request, res: Response) => {
    const foodItems = await foodItemService.getMyFoodItems(
      req.user!._id.toString(),
    );

    sendSuccess(res, { foodItems });
  },
);

export const getFoodItemsByRestaurant = asyncHandler(
  async (req: Request, res: Response) => {
    const foodItems = await foodItemService.getByRestaurantId(
      req.params.restaurantId as string,
    );

    sendSuccess(res, { foodItems });
  },
);

export const getFoodItemsByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const foodItems = await foodItemService.getByCategoryId(
      req.params.categoryId as string,
    );

    sendSuccess(res, { foodItems });
  },
);

export const updateFoodItem = asyncHandler(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[] | undefined;
    const imageBuffers = files?.map((f) => f.buffer);

    const foodItem = await foodItemService.update(
      req.params.id as string,
      req.user!._id.toString(),
      req.body,
      imageBuffers,
    );

    sendSuccess(res, { foodItem });
  },
);

export const deleteFoodItemImage = asyncHandler(
  async (req: Request, res: Response) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      throw new ValidationError("Image URL is required");
    }

    const foodItem = await foodItemService.deleteImage(
      req.params.id as string,
      req.user!._id.toString(),
      imageUrl,
    );

    sendSuccess(res, { foodItem });
  },
);

export const deleteFoodItem = asyncHandler(
  async (req: Request, res: Response) => {
    await foodItemService.delete(
      req.params.id as string,
      req.user!._id.toString(),
    );

    sendSuccess(res, undefined, "Food item deleted successfully");
  },
);
