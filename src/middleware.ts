import { NextRequest, NextResponse } from "next/server";
// import { roleProtectedRoutes, RoleType } from "./lib/roles";

// /**
//  * Middleware function to handle route protection based on user roles
//  * @param req NextRequest object
//  * @returns NextResponse
//  */
// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
  
//   const userRole = req.cookies.get("user_role")?.value as RoleType || "all";

//   // Sort routes by descending length to match more specific routes first
//   const sortedRoutes = Object.keys(roleProtectedRoutes).sort((a, b) => b.length - a.length);

//   for (const route of sortedRoutes) {
//     if (pathname.startsWith(route)) {
//       const allowedRoles = roleProtectedRoutes[route];
//       if (!allowedRoles.includes(userRole)) {
//         // Redirect to dashboard if user doesn't have access to the specific route
//         console.log(`User with role ${userRole} attempted to access ${pathname} but was denied`);
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
//   ],
// }; 

export default function middleware(req: NextRequest) {
  
  // const userRole = req.cookies.get("user_role")?.value;
  // console.log("Cookie 'user_role' value:", userRole);

}