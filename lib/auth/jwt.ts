import { SignJWT, jwtVerify } from "jose";

export type AccessPayload = {
  sub: string;
  role: "dishub" | "superadmin" | string;
  nama?: string;
  typ?: "access";
};

function secretKey() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "AUTH_SECRET harus di-set (minimal 16 karakter) untuk JWT sesi.",
    );
  }
  return new TextEncoder().encode(s);
}

export async function signAccessToken(
  payload: AccessPayload,
  maxAgeSec = 60 * 15,
) {
  return new SignJWT({
    sub: payload.sub,
    role: payload.role,
    nama: payload.nama,
    typ: "access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSec}s`)
    .sign(secretKey());
}

export async function signRefreshToken(sub: string, maxAgeSec = 60 * 60 * 24 * 7) {
  return new SignJWT({ typ: "refresh", sub })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSec}s`)
    .sign(secretKey());
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey());
  if (payload.typ === "refresh") {
    throw new Error("Token bukan access token");
  }
  const role = String(payload.role ?? "");
  if (role !== "dishub" && role !== "superadmin") {
    throw new Error("Role tidak diizinkan");
  }
  return payload as AccessPayload & { exp: number };
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey());
  if (payload.typ !== "refresh") {
    throw new Error("Token bukan refresh token");
  }
  const sub = String(payload.sub ?? "");
  if (!sub) throw new Error("Refresh tanpa sub");
  return { sub };
}
