import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Get the path
  const path = request.nextUrl.pathname;

  // 2. Define protected routes
  const isPublicPath = path === "/login" || path === "/signup";

  // 3. Get the token/role from the cookies (Mock logic)
  // In a real app, you would verify the JWT token
  const token = request.cookies.get("token")?.value || "";
  const role = request.cookies.get("role")?.value || ""; // 'admin' | 'vendor'

  // 4. Redirect logic
  if (isPublicPath && token) {
    // If user is already logged in and tries to access login/signup, redirect to their dashboard
    if (role === "admin") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.nextUrl),
      );
    } else if (role === "vendor") {
      return NextResponse.redirect(
        new URL("/vendor/dashboard", request.nextUrl),
      );
    }
  }

  if (!isPublicPath && !token) {
    // If accessing a protected route without a token, redirect to login
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Role based protection
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (path.startsWith("/vendor") && role !== "vendor") {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/signup", "/admin/:path*", "/vendor/:path*"],
};
