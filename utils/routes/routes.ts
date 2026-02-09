export const protectedRoutes: string[] = [
    "/",
    "/dashboard",
    "/create-post",
    "/profile",
    "/chat",
    "/friends",
    
    // dynamic routes
    "/user/:id",
    "/post/:postId",
    "/post/:postId/comments",
    "/chat/:uid",

    // testing routes
    "/testing"
];

export const publicRoutes: string[] = [
    "/login",
    "/signup",
    "/sub"
];