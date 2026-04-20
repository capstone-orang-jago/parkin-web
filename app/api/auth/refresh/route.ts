import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/cookies";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth/cookie-headers";
import { getAuthAdapter } from "@/lib/auth/get-adapter";

export async function POST() {
  let adapter;
  try {
    adapter = getAuthAdapter();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Konfigurasi auth gagal." },
      { status: 500 },
    );
  }

  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;

  try {
    const result = await adapter.refresh({ accessToken: access, refreshToken: refresh });
    if (!result.ok) {
      const res = NextResponse.json({ error: result.message }, { status: result.status });
      clearAuthCookies(res);
      return res;
    }
    const res = NextResponse.json({ ok: true });
    setAuthCookies(res, result.accessToken, result.refreshToken);
    return res;
  } catch (e) {
    const res = NextResponse.json(
      {
        error:
          e instanceof Error
            ? e.message
            : "Gagal memperbarui sesi. Periksa AUTH_SECRET.",
      },
      { status: 500 },
    );
    clearAuthCookies(res);
    return res;
  }
}

