import { NextRequest, NextResponse } from "next/server";
import { roleProtectedRoutes, RoleType } from "./lib/roles";

/**
 * Middleware function to handle route protection based on user roles
 * @param req NextRequest object
 * @returns NextResponse
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Get user role from cookie, default to a role with minimal access if not present
  const userRole = req.cookies.get("user_role")?.value as RoleType;
  
  if (!userRole) {
    // console.log("No user role cookie found, redirecting to login");
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  // console.log(`User role: ${userRole}, accessing path: ${pathname}`);
  
  const sortedRoutes = Object.keys(roleProtectedRoutes).sort((a, b) => b.length - a.length);
  
  for (const route of sortedRoutes) {
    if (pathname.startsWith(route)) {
      const allowedRoles = roleProtectedRoutes[route];
      
      // If user doesn't have permission for this route
      if (!allowedRoles.includes(userRole)) {
        // console.log(`Access denied: ${userRole} not authorized for ${pathname}`);
        
        // Redirect to dashboard or access denied page
        const url = req.nextUrl.clone();
        url.pathname = '/unauthorized'; // Or consider a dedicated "access denied" page
        return NextResponse.redirect(url);
      }
      
      // User has permission, exit the loop early
      // console.log(`Access granted: ${userRole} is authorized for ${pathname}`);
      break;
    }
  }
  
  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which paths should be checked by the middleware
export const config = {
  matcher: [
    // Match all routes that start with /dashboard
    '/dashboard/:path*',
  ],
};