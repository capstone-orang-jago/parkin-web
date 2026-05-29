import { jwtVerify } from "jose";

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
