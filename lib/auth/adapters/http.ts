import type { AuthAdapter, LoginInput, LoginResult, LogoutInput, RefreshInput } from "./types";

function pickToken(body: unknown, keys: string[]): string | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  const data = o.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    for (const k of keys) {
      const v = d[k];
      if (typeof v === "string" && v.length > 0) return v;
    }
  }
  return null;
}

function pickAccessToken(body: unknown) {
  return pickToken(body, ["access_token", "accessToken", "token", "access"]);
}

function pickRefreshToken(body: unknown) {
  return pickToken(body, ["refresh_token", "refreshToken", "refresh"]);
}

export function createHttpAdapter(baseUrl: string): AuthAdapter {
  const base = baseUrl.replace(/\/$/, "");

  return {
    async login({ phone, password }: LoginInput): Promise<LoginResult> {
      let res: Response;
      try {
        res = await fetch(`${base}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nomor_telepon: phone,
            phone,
            password,
          }),
          cache: "no-store",
        });
      } catch {
        return {
          ok: false,
          status: 502,
          message: "Tidak dapat menghubungi server. Periksa API_BASE_URL.",
        };
      }

      const text = await res.text();
      let body: unknown = null;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = null;
      }

      if (res.status === 403) {
        const msg =
          typeof body === "object" &&
          body &&
          "message" in body &&
          typeof (body as { message: unknown }).message === "string"
            ? String((body as { message: string }).message)
            : "Akun tidak memiliki akses dashboard.";
        return { ok: false, status: 403, message: msg };
      }

      if (!res.ok) {
        return {
          ok: false,
          status: 401,
          message: "Nomor telepon atau password salah.",
        };
      }

      const access = pickAccessToken(body);
      if (!access) {
        return {
          ok: false,
          status: 502,
          message: "Respons login tidak berisi token (sesuaikan parser di http.ts).",
        };
      }

      const refresh = pickRefreshToken(body) ?? undefined;
      return { ok: true, accessToken: access, refreshToken: refresh };
    },

    async refresh(input: RefreshInput): Promise<LoginResult> {
      const bearer = input.refreshToken ?? input.accessToken;
      if (!bearer) {
        return { ok: false, status: 401, message: "Sesi berakhir." };
      }

      let res: Response;
      try {
        res = await fetch(`${base}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          cache: "no-store",
        });
      } catch {
        return {
          ok: false,
          status: 502,
          message: "Gagal memperbarui sesi.",
        };
      }

      const text = await res.text();
      let body: unknown = null;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = null;
      }

      if (!res.ok) {
        return { ok: false, status: 401, message: "Sesi berakhir. Silakan masuk lagi." };
      }

      const access = pickAccessToken(body);
      if (!access) {
        return {
          ok: false,
          status: 502,
          message: "Respons refresh tidak berisi token.",
        };
      }
      const refresh = pickRefreshToken(body) ?? input.refreshToken;
      return { ok: true, accessToken: access, refreshToken: refresh };
    },

    async logout(input: LogoutInput) {
      const bearer = input.accessToken;
      if (!bearer) return;
      try {
        await fetch(`${base}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          cache: "no-store",
        });
      } catch {
        /* best-effort */
      }
    },
  };
}
