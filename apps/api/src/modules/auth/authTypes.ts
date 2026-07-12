import {
  signupSchema,
  signinSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordSchema,
} from "@dfood/validation";

export {
  signupSchema,
  signinSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordSchema,
};

export type { SignupInput, SigninInput, ForgotPasswordInput, VerifyOTPInput, ResetPasswordInput } from "@dfood/validation";

export enum UserRole {
  CUSTOMER = "customer",
  VENDOR = "vendor",
  ADMIN = "admin",
}

export type SanitizedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
};
