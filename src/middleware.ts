import { createRouteMatcher, clerkMiddleware } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  "/test",
  "/"
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})



export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};