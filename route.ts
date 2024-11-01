/**
 * An array of routes that are accessible to the public 
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes = [
    "/",
    "/auth/new-verification"
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect loggedin user to /dashboard
 * @type {string[]}
 */
export const authRoutes = [
    "/signin",
    "/signup",
];

/**
 * The prefix for api authentication routes
 * Routes that start with these prefix are used for API auth purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/** 
 * The default redirect path after loggin in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard"