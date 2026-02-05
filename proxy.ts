import { NextRequest, NextResponse } from "next/server";
import { protectedRoutes, publicRoutes } from "./utils/routes/routes";
import { matchRoute } from "./utils/routes/matchRoute";

const middlewareResponse = async (req: NextRequest) => {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // check protectedRoute hit? (supports dynamic)
    const isProtected = protectedRoutes.some((route:any) => matchRoute(route, pathname));

    // check publicRoute hit?
    const isPublic = publicRoutes.some((route:any) => matchRoute(route, pathname));


    // Unauthorized user trying protected route
    if (!token && isProtected) {
        console.log("redirect → login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Logged-in user trying public route (login/signup)
    if (token && isPublic) {
        console.log("redirect → home page");
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
};

export default middlewareResponse;

export const config = {
    matcher: [
        "/((?!_next|favicon.ico|api|.well-known).*)"
    ]
};