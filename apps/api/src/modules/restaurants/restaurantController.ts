import { Request, Response } from "express";
import { restaurantService } from "./restaurantService";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { ValidationError } from "../../types/errors";
import Restaurant from "../../models/Restaurant";

export const createRestaurant = asyncHandler(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new ValidationError("At least one restaurant image is required");
    }

    const data = req.body;
    const imageBuffers = files.map((f) => f.buffer);

    const restaurant = await restaurantService.create(
      req.user!._id.toString(),
      data,
      imageBuffers,
    );

    sendSuccess(
      res,
      { restaurant },
      "Restaurant created successfully. You are now a vendor!",
      201,
    );
  },
);

export const getRestaurantById = asyncHandler(
  async (req: Request, res: Response) => {
    const restaurant = await restaurantService.getById(req.params.id as string);

    sendSuccess(res, { restaurant });
  },
);

export const getMyRestaurant = asyncHandler(
  async (req: Request, res: Response) => {
    const restaurant = await restaurantService.getByOwnerId(
      req.user!._id.toString(),
    );

    sendSuccess(res, { restaurant });
  },
);

export const getAllRestaurants = asyncHandler(
  async (req: Request, res: Response) => {
    const isOpen = req.query.isOpen === "true";
    const restaurants = await restaurantService.getAll({
      isOpen: isOpen || undefined,
    });

    sendSuccess(res, { restaurants });
  },
);

export const updateRestaurant = asyncHandler(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[] | undefined;
    const data = req.body;
    const imageBuffers = files?.map((f) => f.buffer);

    const restaurant = await restaurantService.update(
      req.params.id as string,
      req.user!._id.toString(),
      data,
      imageBuffers,
    );

    sendSuccess(res, { restaurant });
  },
);

export const deleteRestaurantImage = asyncHandler(
  async (req: Request, res: Response) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      throw new ValidationError("Image URL is required");
    }

    const restaurant = await restaurantService.deleteImage(
      req.params.id as string,
      req.user!._id.toString(),
      imageUrl,
    );

    sendSuccess(res, { restaurant });
  },
);

export const deleteRestaurant = asyncHandler(
  async (req: Request, res: Response) => {
    await restaurantService.delete(
      req.params.id as string,
      req.user!._id.toString(),
    );

    sendSuccess(res, {}, "Restaurant deleted successfully");
  },
);

export const getProfileStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const restaurant = await Restaurant.findOne({ ownerId: req.user!._id });

    if (!restaurant) {
      return sendSuccess(res, {
        hasRestaurant: false,
        isProfileComplete: false,
        missingFields: ["restaurant"],
      });
    }

    const missingFields: string[] = [];
    if (restaurant.images.length === 0) missingFields.push("images");
    if (!restaurant.address) missingFields.push("address");
    if (!restaurant.description) missingFields.push("description");

    return sendSuccess(res, {
      hasRestaurant: true,
      isProfileComplete: restaurant.isProfileComplete,
      missingFields,
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        images: restaurant.images,
        address: restaurant.address,
        description: restaurant.description,
      },
    });
  },
);
