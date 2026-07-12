import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { vendorOrderService } from "./vendorOrderService";
import { sendSuccess } from "../../utils/response";

export const getRestaurantOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const { status, startDate, endDate } = req.query;

    const filters: any = {};
    if (status) filters.status = status;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);

    const orders = await vendorOrderService.getRestaurantOrders(
      req.user!._id.toString(),
      filters,
    );

    sendSuccess(res, { orders });
  },
);

export const getVendorOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await vendorOrderService.getOrderById(
      req.user!._id.toString(),
      req.params.id as string,
    );

    sendSuccess(res, { order });
  },
);

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body;

    const order = await vendorOrderService.updateOrderStatus(
      req.user!._id.toString(),
      req.params.id as string,
      status,
    );

    sendSuccess(res, { order }, "Order status updated successfully");
  },
);

export const getVendorOrderStats = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await vendorOrderService.getOrderStats(
      req.user!._id.toString(),
    );

    sendSuccess(res, stats);
  },
);
