import { NextRequest, NextResponse } from "next/server";
import { protectedRoutes, publicRoutes } from "./utils/routes/routes";
import { matchRoute } from "./utils/routes/matchRoute";

const middlewareResponse = async (req: NextRequest) => {
    const token = req.cookies.get("U-t-pos")?.value;
    const { pathname } = req.nextUrl;

    // Skip middleware for static files, API routes, and Next.js internals
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.startsWith("/.well-known") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Check if route is protected (supports dynamic routes)
    const isProtected = protectedRoutes.some((route: string) => matchRoute(route, pathname));

    // Check if route is public
    const isPublic = publicRoutes.some((route: string) => matchRoute(route, pathname));

    // Unauthorized user trying to access protected route
    if (!token && isProtected) {
        console.log(`[Middleware] Unauthorized access to protected route: ${pathname} → redirecting to login`);
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Logged-in user trying to access auth pages (login/signup) - redirect to dashboard
    if (token && (pathname === "/auth/login" || pathname === "/auth/signup")) {
        console.log(`[Middleware] Authenticated user accessing auth page: ${pathname} → redirecting to dashboard`);
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Allow logged-in users to access public pages (/, /about, /pricing)
    // They can view these pages even when authenticated

    // Allow access to public routes and protected routes (if authenticated)
    return NextResponse.next();
};

export default middlewareResponse;

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (API routes)
         * - .well-known (well-known files)
         * - public files (images, etc.)
         */
        "/((?!_next/static|_next/image|favicon.ico|api|.well-known|.*\\..*).*)",
    ],
};