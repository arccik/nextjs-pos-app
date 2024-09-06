import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If the user is authenticated, allow the request
    const pathname = req.nextUrl.pathname;
    if (pathname === "/login") {
      return NextResponse.next();
    }
    if (req.nextauth.token) {
      return NextResponse.next();
    }

    // If not authenticated, redirect to login page
    return NextResponse.redirect(new URL("/login", req.url));
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication routes - modify this if your auth routes are different)
     */
    // "/((?!api|_next/static|_next/image|favicon.ico|auth|login).*)",
  ],
};
