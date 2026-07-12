import { z } from "zod";

// ── Auth schemas ──────────────────────────────────────────────────

export const signupSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(4),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8).max(128),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ── Food item schemas ────────────────────────────────────────────

export const createFoodItemSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  price: z.coerce.number().min(0),
  categoryIds: z
    .array(z.string())
    .min(1)
    .max(3, "Maximum 3 categories allowed"),
  calories: z.coerce.number().int().min(0).optional(),
});

export const updateFoodItemSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  price: z.coerce.number().min(0).optional(),
  categoryIds: z.array(z.string()).min(1).max(3).optional(),
  calories: z.coerce.number().int().min(0).optional(),
});

export type CreateFoodItemInput = z.infer<typeof createFoodItemSchema>;
export type UpdateFoodItemInput = z.infer<typeof updateFoodItemSchema>;
