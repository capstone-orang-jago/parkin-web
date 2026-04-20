import type { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  serializeAccessCookie,
  serializeClearCookie,
  serializeRefreshCookie,
} from "./cookies";

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken?: string,
) {
  res.headers.append("Set-Cookie", serializeAccessCookie(accessToken));
  if (refreshToken) {
    res.headers.append("Set-Cookie", serializeRefreshCookie(refreshToken));
  }
}

export function clearAuthCookies(res: NextResponse) {
  res.headers.append("Set-Cookie", serializeClearCookie(ACCESS_COOKIE));
  res.headers.append("Set-Cookie", serializeClearCookie(REFRESH_COOKIE));
}
