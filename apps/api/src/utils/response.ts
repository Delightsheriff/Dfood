import { Response } from "express";

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
) {
  return res.status(statusCode).json({
    success: true as const,
    data,
    ...(message && { message }),
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: { field: string; message: string }[],
) {
  return res.status(statusCode).json({
    success: false as const,
    message,
    ...(errors && errors.length > 0 && { errors }),
  });
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number },
) {
  return res.status(200).json({
    success: true as const,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit),
    },
  });
}
