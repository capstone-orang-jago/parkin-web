import { jwtVerify } from "jose";
import { ACCESS_COOKIE } from "./cookies";


/**
 * Verifikasi ringan untuk Edge middleware (HS256 + role).
 * Tidak melempar jika secret hilang atau token rusak.
 */
export async function tryVerifyAccessCookie(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (payload.typ === "refresh") return false;
    const role = String(payload.role ?? "");
    return role === "dishub" || role === "superadmin";
  } catch {
    return false;
  }
}
