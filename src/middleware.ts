import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function applySecurityHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const pathname = nextUrl.pathname;

  // Trailing slash normalization (308 permanent redirect)
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = new URL(pathname.slice(0, -1), nextUrl);
    return NextResponse.redirect(url, 308);
  }

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  // Add X-Robots-Tag noindex for auth pages
  if (isAuthPage) {
    // Redirect logged-in users away from auth pages
    if (isLoggedIn) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL("/dashboard", nextUrl))
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return applySecurityHeaders(response);
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return applySecurityHeaders(
      NextResponse.redirect(new URL("/login", nextUrl))
    );
  }

  // Protect onboarding
  if (pathname.startsWith("/onboarding") && !isLoggedIn) {
    return applySecurityHeaders(
      NextResponse.redirect(new URL("/login", nextUrl))
    );
  }

  return applySecurityHeaders(NextResponse.next());
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
