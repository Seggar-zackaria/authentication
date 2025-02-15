import { auth } from "@/auth";

// export { auth as middleware } from "@/auth";

export default auth((req) => {
  console.log("ROUTE: ", req.nextUrl.pathname);
});
// 2:15

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
