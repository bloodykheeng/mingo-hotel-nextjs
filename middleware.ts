import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define role-based route groups
const routeGroups = {
  // Public routes that don't require authentication
  public: [
    "/",
    // "/services/report",
    "/login",
    "/register",
    "/forgot-password"
  ],

  // Routes accessible by all authenticated users
  authenticated: ["/dashboard", "/dashboard/users"],

  // Routes accessible only by system admin
  systemAdminOnly: [
    // "/dashboard/users",
    "/dashboard/rooms",
    "/dashboard/features",
    "/dashboard/faqs",
    "/dashboard/roles",
    "/dashboard/audit-trail"
  ]
};

export function middleware(req: NextRequest) {
  // Get profile from cookies
  const profileCookie = req.cookies.get("profile")?.value ?? "";
  console.log("🚀 ~ middleware ~ profileCookie:", profileCookie);

  //   Parse the profile to get the user role
  let profile;
  try {
    profile = JSON.parse(profileCookie);
  } catch (e) {
    // Invalid cookie format, redirect to not found
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }
  const loggedInUserRole = profile?.role;

  // Define role groups
  const systemAdminRoles = ["System Admin"];

  // Get current path
  const currentPath = req.nextUrl.pathname;
  console.log("🚀 ~ middleware ~ currentPath:", currentPath);
  const searchParams = req.nextUrl.searchParams;

  if (!profile) {
    // Check if it's a public route that doesn't require authentication
    if (routeGroups.public.includes(currentPath)) {
      return NextResponse.next();
    }

    //if no match just give not found
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  if (profile) {
    // Check if path is in authenticated routes (accessible by all authenticated users)
    if (routeGroups.authenticated.includes(currentPath)) {
      return NextResponse.next();
    }

    // Check System Admin-only routes
    if (routeGroups.systemAdminOnly.includes(currentPath)) {
      if (systemAdminRoles.includes(loggedInUserRole)) {
        return NextResponse.next();
      } else {
        return NextResponse.rewrite(new URL("/not-found", req.url));
      }
    }

    // If the path is not one of the expected ones, rewrite to not-found
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  //   // Allow all other requests to proceed
  //   return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"] // Apply middleware only to these routes
};
