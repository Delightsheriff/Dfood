import { Request, Response } from "express";
import { orderService } from "./orderService";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const order = await orderService.create(req.user!._id.toString(), data);

  sendSuccess(res, { order }, "Order placed successfully", 201);
});

export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await orderService.getById(
      req.params.id as string,
      req.user!._id.toString(),
    );

    sendSuccess(res, { order });
  },
);

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await orderService.getMyOrders(req.user!._id.toString());

  sendSuccess(res, { orders });
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.cancel(
    req.params.id as string,
    req.user!._id.toString(),
  );

  sendSuccess(res, { order }, "Order cancelled successfully");
});

export const getOrderByNumber = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await orderService.getByOrderNumber(
      req.params.orderNumber as string,
      req.user!._id.toString(),
    );

    sendSuccess(res, { order });
  },
);
