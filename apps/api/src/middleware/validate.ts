import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

type ValidationSource = "body" | "query" | "params";

export function validate<T>(
  schema: ZodType<T>,
  source: ValidationSource = "body",
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(result.error);
    }
    req[source] = result.data;
    next();
  };
}
