// Public routes - accessible without authentication
export const publicRoutes: string[] = [
    "/",                    // Landing page
    "/auth/login",          // Login page
    "/auth/signup",         // Signup page
    "/about",               // About page
    "/pricing",             // Pricing page
];

// Protected routes - require authentication
export const protectedRoutes: string[] = [
    "/dashboard",                          // Main dashboard
    "/dashboard/projects",                 // Projects list
    "/dashboard/projects/:id/products",    // Products management (dynamic)
    "/dashboard/projects/:id/members",     // Members management (dynamic)
    "/dashboard/projects/:id/sales",       // Sales dashboard (dynamic)
    "/staff",                              // Staff POS panel
];
