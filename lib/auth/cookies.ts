/** Cookie names — stabil untuk middleware dan BFF. */
export const ACCESS_COOKIE = "parkin_access";
export const REFRESH_COOKIE = "parkin_refresh";

const ACCESS_MAX_AGE = 60 * 15; // 15 menit
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function baseAttrs() {
  const secure = isProduction();
  return `Path=/; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`;
}

/** Serializes one Set-Cookie header value (name=value; attributes). */
export function serializeAccessCookie(token: string) {
  return `${ACCESS_COOKIE}=${encodeURIComponent(token)}; Max-Age=${ACCESS_MAX_AGE}; ${baseAttrs()}`;
}

export function serializeRefreshCookie(token: string) {
  return `${REFRESH_COOKIE}=${encodeURIComponent(token)}; Max-Age=${REFRESH_MAX_AGE}; ${baseAttrs()}`;
}

export function serializeClearCookie(name: string) {
  return `${name}=; Max-Age=0; ${baseAttrs()}`;
}

