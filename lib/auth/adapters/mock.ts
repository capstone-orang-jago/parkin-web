import { REFRESH_MAX_AGE } from "../cookies";
import {
	signAccessToken,
	signRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
} from "../jwt";
import type {
	AuthAdapter,
	LoginInput,
	LoginResult,
	LogoutInput,
	RefreshInput,
} from "./types";

function envOrDev(key: string, devFallback: string) {
	const v = process.env[key]?.trim();
	if (v) return v;
	if (process.env.NODE_ENV !== "production") return devFallback;
	return "";
}

export function createMockAdapter(): AuthAdapter {
	return {
		async login({ email, password }: LoginInput): Promise<LoginResult> {
			const adminEmail = envOrDev("DUMMY_ADMIN_EMAIL", "admin@example.com");
			const adminPass = envOrDev("DUMMY_ADMIN_PASSWORD", "admin123");
			const blockedEmail = process.env.DUMMY_BLOCKED_EMAIL?.trim() ?? "";
			const blockedPass = process.env.DUMMY_BLOCKED_PASSWORD?.trim() ?? "";

			if (
				blockedEmail &&
				blockedPass &&
				email === blockedEmail &&
				password === blockedPass
			) {
				return {
					ok: false,
					status: 403,
					message:
						"Akun ini tidak memiliki akses dashboard (role bukan Dishub/Superadmin).",
				};
			}

			if (email === adminEmail && password === adminPass) {
				const access = await signAccessToken({
					sub: "mock-admin",
					role: "dishub",
					nama: "Admin Dummy",
				});
				const refresh = await signRefreshToken("mock-admin", REFRESH_MAX_AGE);
				return { ok: true, accessToken: access, refreshToken: refresh };
			}

			if (email === adminEmail || (blockedEmail && email === blockedEmail)) {
				return {
					ok: false,
					status: 401,
					message: "Email atau password salah.",
				};
			}

			return {
				ok: false,
				status: 401,
				message: "Email atau password salah.",
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
				return {
					ok: false,
					status: 401,
					message: "Sesi berakhir. Silakan masuk lagi.",
				};
			}

			try {
				const payload = await verifyAccessToken(accessToken);
				const access = await signAccessToken({
					sub: String(payload.sub),
					role: payload.role as "dishub" | "superadmin",
					nama: payload.nama as string | undefined,
				});
				const nextRefresh = await signRefreshToken(
					String(payload.sub),
					REFRESH_MAX_AGE,
				);
				return {
					ok: true,
					accessToken: access,
					refreshToken: nextRefresh,
				};
			} catch {
				return {
					ok: false,
					status: 401,
					message: "Sesi berakhir. Silakan masuk lagi.",
				};
			}
		},

		async logout(_: LogoutInput) {
			void _;
			/* Backend dummy: tidak ada panggilan jaringan */
		},
	};
}
