import { Request, Response } from "express";
import { paymentMethodService } from "./paymentMethodService";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";

export const addCard = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const paymentMethod = await paymentMethodService.addCard(
    req.user!._id.toString(),
    data,
  );

  sendSuccess(res, { paymentMethod }, "Card added successfully", 201);
});

export const getAllPaymentMethods = asyncHandler(
  async (req: Request, res: Response) => {
    const paymentMethods = await paymentMethodService.getAll(
      req.user!._id.toString(),
    );

    sendSuccess(res, { paymentMethods });
  },
);

export const setDefaultPaymentMethod = asyncHandler(
  async (req: Request, res: Response) => {
    const paymentMethod = await paymentMethodService.setDefault(
      req.params.id as string,
      req.user!._id.toString(),
    );

    sendSuccess(res, { paymentMethod });
  },
);

export const deletePaymentMethod = asyncHandler(
  async (req: Request, res: Response) => {
    await paymentMethodService.delete(
      req.params.id as string,
      req.user!._id.toString(),
    );

    sendSuccess(res, {}, "Payment method deleted successfully");
  },
);

export const getDefaultPaymentMethod = asyncHandler(
  async (req: Request, res: Response) => {
    const paymentMethod = await paymentMethodService.getDefault(
      req.user!._id.toString(),
    );

    sendSuccess(res, { paymentMethod });
  },
);
