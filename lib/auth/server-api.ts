import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./cookies";

/**
 * Membaca access token dari cookie.
 */
export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

/**
 * Fetch wrapper yang otomatis retry sekali saat 401 (expired access token).
 *
 * Alur:
 * 1. Fetch dengan access token dari cookie
 * 2. Jika 401 → coba refresh via BFF → retry dengan token baru
 * 3. Cookie diperbarui oleh BFF, sehingga request berikutnya sudah fresh
 *
 * Catatan: Set-Cookie dari BFF refresh akan dikirim ke browser,
 * sehingga request berikutnya akan menggunakan token baru.
 */
export async function fetchWithTokenRetry(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const accessToken = await getAccessToken();

  // Pastikan Authorization header ter-set
  const headers = new Headers(options.headers);
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let res = await fetch(url, { ...options, headers, cache: "no-store" });

  // Jika 401, coba refresh sekali
  if (res.status === 401) {
    const jar = await cookies();
    const refresh = jar.get(REFRESH_COOKIE)?.value;
    if (!refresh) return res;

    const access = jar.get(ACCESS_COOKIE)?.value;
    const cookieParts = [
      `${REFRESH_COOKIE}=${encodeURIComponent(refresh)}`,
    ];
    if (access) {
      cookieParts.push(`${ACCESS_COOKIE}=${encodeURIComponent(access)}`);
    }

    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/auth/refresh`,
        {
          method: "POST",
          headers: { Cookie: cookieParts.join("; ") },
        },
      );

      if (refreshRes.ok) {
        // Baca ulang token dari cookie (BFF sudah update cookie jar)
        const newToken = (await cookies()).get(ACCESS_COOKIE)?.value;
        if (newToken) {
          const retryHeaders = new Headers(options.headers);
          retryHeaders.set("Authorization", `Bearer ${newToken}`);
          res = await fetch(url, {
            ...options,
            headers: retryHeaders,
            cache: "no-store",
          });
        }
      }
    } catch {
      // Refresh gagal, return response 401 asli
    }
  }

  return res;
}
