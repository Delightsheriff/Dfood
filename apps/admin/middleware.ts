import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Public routes that don't require authentication
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth");

  // If not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access auth pages, redirect based on role
  if (token && (pathname === "/login" || pathname === "/signup")) {
    const dashboardUrl =
      token.role === "admin" ? "/admin/dashboard" : "/vendor/dashboard";
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  // Role-based access control
  if (token) {
    // Admins trying to access vendor routes
    if (pathname.startsWith("/vendor") && token.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // Vendors trying to access admin routes
    if (pathname.startsWith("/admin") && token.role === "vendor") {
      return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
    }

    // Customers trying to access dashboard routes
    if (
      (pathname.startsWith("/admin") || pathname.startsWith("/vendor")) &&
      token.role === "customer"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect from root /admin or /vendor to their dashboard
    if (pathname === "/admin" && token.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (pathname === "/vendor" && token.role === "vendor") {
      return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
