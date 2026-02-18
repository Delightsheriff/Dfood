import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Get session on the server side
 * Use in Server Components, Server Actions, and API routes
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get current user from session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Check if user has required role
 */
export async function requireRole(role: string | string[]) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const roles = Array.isArray(role) ? role : [role];

  if (!roles.includes(user.role)) {
    throw new Error("Forbidden: Insufficient permissions");
  }

  return user;
}

/**
 * Check if user is admin
 */
export async function requireAdmin() {
  return await requireRole("admin");
}

/**
 * Check if user is vendor
 */
export async function requireVendor() {
  return await requireRole("vendor");
}

/**
 * Check if user is admin or vendor (dashboard access)
 */
export async function requireDashboardAccess() {
  return await requireRole(["admin", "vendor"]);
}
