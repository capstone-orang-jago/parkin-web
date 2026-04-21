import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, tryVerifyAccessCookie } from "./lib/auth/session-edge";

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/transaksi/:path*",
    "/lokasi/:path*",
    "/petugas/:path*",
    "/laporan/:path*",
  ],
};

function isProtectedAppPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/transaksi") ||
    pathname.startsWith("/lokasi") ||
    pathname.startsWith("/petugas") ||
    pathname.startsWith("/laporan")
  );
}

function withPathnameHeader(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return requestHeaders;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const ok = await tryVerifyAccessCookie(token);

  if (pathname === "/login") {
    if (ok) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next({
      request: { headers: withPathnameHeader(request) },
    });
  }

  if (isProtectedAppPath(pathname)) {
    if (!ok) {
      const url = new URL("/login", request.url);
      if (token) {
        url.searchParams.set("reason", "session_expired");
      }
      return NextResponse.redirect(url);
    }
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next({
      request: { headers: withPathnameHeader(request) },
    });
  }

  return NextResponse.next({
    request: { headers: withPathnameHeader(request) },
  });
}
