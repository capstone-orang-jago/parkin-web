import { REFRESH_MAX_AGE } from "../cookies";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../jwt";
import type { AuthAdapter, LoginInput, LoginResult, LogoutInput, RefreshInput } from "./types";

function envOrDev(key: string, devFallback: string) {
  const v = process.env[key]?.trim();
  if (v) return v;
  if (process.env.NODE_ENV !== "production") return devFallback;
  return "";
}

export function createMockAdapter(): AuthAdapter {
  return {
    async login({ phone, password }: LoginInput): Promise<LoginResult> {
      const adminPhone = envOrDev("DUMMY_ADMIN_PHONE", "0800000000");
      const adminPass = envOrDev("DUMMY_ADMIN_PASSWORD", "admin123");
      const blockedPhone = process.env.DUMMY_BLOCKED_PHONE?.trim() ?? "";
      const blockedPass = process.env.DUMMY_BLOCKED_PASSWORD?.trim() ?? "";

      if (
        blockedPhone &&
        blockedPass &&
        phone === blockedPhone &&
        password === blockedPass
      ) {
        return {
          ok: false,
          status: 403,
          message:
            "Akun ini tidak memiliki akses dashboard (role bukan Dishub/Superadmin).",
        };
      }

      if (phone === adminPhone && password === adminPass) {
        const access = await signAccessToken({
          sub: "mock-admin",
          role: "dishub",
          nama: "Admin Dummy",
        });
        const refresh = await signRefreshToken("mock-admin", REFRESH_MAX_AGE);
        return { ok: true, accessToken: access, refreshToken: refresh };
      }

      if (phone === adminPhone || (blockedPhone && phone === blockedPhone)) {
        return {
          ok: false,
          status: 401,
          message: "Nomor telepon atau password salah.",
        };
      }

      return {
        ok: false,
        status: 401,
        message: "Nomor telepon atau password salah.",
      };
    },

    async refresh(input: RefreshInput): Promise<LoginResult> {
      const { accessToken, refreshToken } = input;

      if (refreshToken) {
        try {
          const { sub } = await verifyRefreshToken(refreshToken);
          const access = await signAccessToken({
            sub,
            role: "dishub",
            nama: "Admin Dummy",
          });
          const nextRefresh = await signRefreshToken(sub, REFRESH_MAX_AGE);
          return {
            ok: true,
            accessToken: access,
            refreshToken: nextRefresh,
          };
        } catch {
          /* sliding dari access */
        }
      }

      if (!accessToken) {
        return { ok: false, status: 401, message: "Sesi berakhir. Silakan masuk lagi." };
      }

      try {
        const payload = await verifyAccessToken(accessToken);
        const access = await signAccessToken({
          sub: String(payload.sub),
          role: payload.role as "dishub" | "superadmin",
          nama: payload.nama as string | undefined,
        });
        const nextRefresh = await signRefreshToken(String(payload.sub), REFRESH_MAX_AGE);
        return {
          ok: true,
          accessToken: access,
          refreshToken: nextRefresh,
        };
      } catch {
        return { ok: false, status: 401, message: "Sesi berakhir. Silakan masuk lagi." };
      }
    },

    async logout(_: LogoutInput) {
      void _;
      /* Backend dummy: tidak ada panggilan jaringan */
    },
  };
}
