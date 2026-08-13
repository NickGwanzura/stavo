import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Static files must remain public so the login/setup screens and the
  // authenticated shell can load the TSM Mobiles logo, icons and fonts.
  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }
  const isPublicAuthRoute = pathname === "/auth/login" || pathname === "/auth/setup";
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie && !isPublicAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (sessionCookie && isPublicAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|api/health|_next/static|_next/image|favicon.ico|manifest.json|icons/).*)"],
};
