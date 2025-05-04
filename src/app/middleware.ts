// import { NextRequest, NextResponse } from "next/server";

// type Role = "Admin" | "approver" | "superuser" | "all";

// const roleProtectedRoutes: { [key: string]: Role[] } = {
//   "/dashboard": ["all"],
//   "/dashboard/approvals": ["approver", "Admin"],
//   "/dashboard/form": ["approver"],
//   "/dashboard/requests": ["approver", "Admin"],
//   "/dashboard/credentials": ["Admin", "superuser"],
//   "/dashboard/business-units": ["Admin", "superuser"],
//   "/dashboard/category-management": ["Admin", "superuser"],
//   "/dashboard/approval-access": ["Admin", "superuser"],
// };

// function getUserRole(req: NextRequest): Role {
//   const role = req.cookies.get("role")?.value as Role | undefined;
//   return role || "all";
// }

// export function middleware(req: NextRequest) {
//     const { pathname } = req.nextUrl
//     const userRole = getUserRole(req)
  
    
//     for (const route in roleProtectedRoutes) {
//       if (pathname.startsWith(route)) {
//         const allowedRoles = roleProtectedRoutes[route]
//         if (!allowedRoles.includes(userRole)) {
          
//           const url = req.nextUrl.clone()
//           url.pathname = '/login'
//           return NextResponse.redirect(url)
//         }
//       }
//     }
  
//     return NextResponse.next()
//   }