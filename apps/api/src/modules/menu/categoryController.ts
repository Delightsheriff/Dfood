import { Request, Response } from "express";
import { categoryService } from "./categoryService";
import { asyncHandler } from "../../utils/asyncHandler";
import { ValidationError } from "../../types/errors";
import { sendSuccess } from "../../utils/response";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ValidationError("Category image is required");
    }

    const category = await categoryService.create(req.body, req.file.buffer);

    sendSuccess(res, { category }, undefined, 201);
  },
);

export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await categoryService.getAll();

    sendSuccess(res, { categories });
  },
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await categoryService.getById(req.params.id as string);

    sendSuccess(res, { category });
  },
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await categoryService.update(
      req.params.id as string,
      req.body,
      req.file?.buffer,
    );

    sendSuccess(res, { category });
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    await categoryService.delete(req.params.id as string);

    sendSuccess(res, undefined, "Category deleted successfully");
  },
);
