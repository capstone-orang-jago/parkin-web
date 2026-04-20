import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/cookies";
import { clearAuthCookies } from "@/lib/auth/cookie-headers";
import { getAuthAdapter } from "@/lib/auth/get-adapter";

export async function POST() {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;

  try {
    const adapter = getAuthAdapter();
    await adapter.logout({ accessToken: access, refreshToken: refresh });
  } catch {
    /* adapter http gagal — tetap hapus cookie lokal */
  }

  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}
