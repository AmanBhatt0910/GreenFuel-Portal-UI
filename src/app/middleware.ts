// import { NextRequest, NextResponse } from "next/server";
// import { RoleType, roleProtectedRoutes } from "../lib/roles";


// function getUserRoleFromCookies(req: NextRequest): RoleType {
//   const role = req.cookies.get("role")?.value as RoleType | undefined;
//   return role || "all";
// }

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
  
//   // For server-side middleware, we can only use cookies
//   // localStorage is only available on the client side
//   const userRole = getUserRoleFromCookies(req);
  
//   // Check if the user has access to the requested route
//   for (const route in roleProtectedRoutes) {
//     if (pathname.startsWith(route)) {
//       const allowedRoles = roleProtectedRoutes[route];
//       if (!allowedRoles.includes(userRole)) {
//         // Redirect to login page if user doesn't have access
//         const url = req.nextUrl.clone();
//         url.pathname = '/dashboard';
//         return NextResponse.redirect(url);
//       }
//     }
//   }
  
//   return NextResponse.next();
// }

// // Configure which paths should be checked by the middleware
// export const config = {
//   matcher: [
//     // Match all routes that start with /dashboard
//     '/dashboard/:path*',
//     // Add other protected routes here
//   ],
// };