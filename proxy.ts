import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
} from "./lib/auth/cookies";
import { tryVerifyAccessCookie } from "./lib/auth/session-edge";

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

/**
 * Coba refresh access token via backend BFF.
 * Mengembalikan NextResponse dengan cookie baru + redirect jika berhasil,
 * atau null jika refresh gagal.
 */
async function tryRefreshToken(
  request: NextRequest,
  refreshToken: string,
): Promise<NextResponse | null> {
  try {
    const refreshUrl = new URL("/api/auth/refresh", request.url);
    const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
    const cookieParts = [
      `${REFRESH_COOKIE}=${encodeURIComponent(refreshToken)}`,
    ];
    if (accessToken) {
      cookieParts.push(
        `${ACCESS_COOKIE}=${encodeURIComponent(accessToken)}`,
      );
    }
    const refreshRes = await fetch(refreshUrl.toString(), {
      method: "POST",
      headers: {
        Cookie: cookieParts.join("; "),
      },
    });

    if (!refreshRes.ok) return null;

    // Ambil Set-Cookie headers dari response refresh
    const setCookies = refreshRes.headers.getSetCookie?.() ?? [];
    if (setCookies.length === 0) return null;

    // Redirect ke halaman yang sama dengan cookie baru
    const response = NextResponse.redirect(request.nextUrl);
    for (const cookie of setCookies) {
      response.headers.append("Set-Cookie", cookie);
    }
    return response;
  } catch {
    return null;
  }
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
      // Access token tidak valid — coba refresh dulu
      const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
      if (refreshToken) {
        const refreshed = await tryRefreshToken(request, refreshToken);
        if (refreshed) return refreshed;
      }

      // Refresh gagal atau tidak ada refresh token → login
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
