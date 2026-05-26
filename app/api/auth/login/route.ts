import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth/cookie-headers";
import { getAuthAdapter } from "@/lib/auth/get-adapter";

export async function POST(request: Request) {
	let body: { email?: string; password?: string };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ error: "Body JSON tidak valid." },
			{ status: 400 },
		);
	}

	let adapter;
	try {
		adapter = getAuthAdapter();
	} catch (e) {
		return NextResponse.json(
			{ error: e instanceof Error ? e.message : "Konfigurasi auth gagal." },
			{ status: 500 },
		);
	}

	try {
		const result = await adapter.login({
			email: String(body.email ?? "").trim(),
			password: String(body.password ?? ""),
		});

		if (!result.ok) {
			return NextResponse.json(
				{ error: result.message },
				{ status: result.status },
			);
		}

		const res = NextResponse.json({ ok: true });
		setAuthCookies(res, result.accessToken, result.refreshToken);
		return res;
	} catch (e) {
		return NextResponse.json(
			{
				error:
					e instanceof Error
						? e.message
						: "Gagal membuat sesi. Periksa AUTH_SECRET (min. 16 karakter).",
			},
			{ status: 500 },
		);
	}
}
