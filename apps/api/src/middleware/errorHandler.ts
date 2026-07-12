import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/errors";
import { ZodError } from "zod";
import { env } from "../config/env";
import { sendError } from "../utils/response";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  if (err instanceof ZodError) {
    return sendError(
      res,
      "Validation failed",
      400,
      err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    );
  }

  console.error("Unexpected error:", err);

  return sendError(
    res,
    env.NODE_ENV === "production" ? "Internal server error" : err.message,
    500,
  );
};
