import { Request, Response } from "express";
import { addressService } from "./addressService";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";

export const createAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const address = await addressService.create(req.user!._id.toString(), req.body);

    sendSuccess(res, { address }, undefined, 201);
  },
);

export const getAllAddresses = asyncHandler(
  async (req: Request, res: Response) => {
    const addresses = await addressService.getAll(req.user!._id.toString());

    sendSuccess(res, { addresses });
  },
);

export const getAddressById = asyncHandler(
  async (req: Request, res: Response) => {
    const address = await addressService.getById(
      req.params.id as string,
      req.user!._id.toString(),
    );

    sendSuccess(res, { address });
  },
);

export const updateAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const address = await addressService.update(
      req.params.id as string,
      req.user!._id.toString(),
      req.body,
    );

    sendSuccess(res, { address });
  },
);

export const setDefaultAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const address = await addressService.setDefault(
      req.params.id as string,
      req.user!._id.toString(),
    );

    sendSuccess(res, { address });
  },
);

export const deleteAddress = asyncHandler(
  async (req: Request, res: Response) => {
    await addressService.delete(
      req.params.id as string,
      req.user!._id.toString(),
    );

    sendSuccess(res, undefined, "Address deleted successfully");
  },
);

export const getDefaultAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const address = await addressService.getDefault(req.user!._id.toString());

    sendSuccess(res, { address });
  },
);
