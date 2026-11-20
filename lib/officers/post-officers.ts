"use server";

import { getAccessToken } from "@/lib/auth/server-api";
import { callBackend } from "@/lib/api/call-backend";
import { mapCreateOfficerError } from "@/lib/officers/officer-errors";

export type OfficerFormValues = {
	name: string;
	email: string;
	password: string;
	telephone: string;
};

export type OfficerSelectOption = {
	id: string;
	name: string;
	telephone: string;
	assignedLocation: string | null;
};

type ApiOfficerForSelect = {
	id: string;
	name: string;
	telephone: string;
	lokasi?: { nama_lokasi?: string } | null;
};

export async function getOfficersForSelect(): Promise<OfficerSelectOption[]> {
	const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
	if (!baseUrl) throw new Error("API_BASE_URL belum disetel.");

	const token = await getAccessToken();
	if (!token) throw new Error("Sesi login tidak ditemukan.");

	const res = await fetch(`${baseUrl}/admin/officers`, {
		headers: { Authorization: `Bearer ${token}` },
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error(`Gagal mengambil daftar petugas: ${res.status}`);
	}

	const payload = await res.json();
	const data: ApiOfficerForSelect[] = Array.isArray(payload) ? payload : (payload.data ?? []);

	return data.map((item) => ({
		id: item.id,
		name: item.name,
		telephone: item.telephone,
		assignedLocation: item.lokasi?.nama_lokasi ?? null,
	}));
}

export type CreateOfficerResult = { ok: true } | { ok: false; message: string };

export async function createOfficer(values: OfficerFormValues): Promise<CreateOfficerResult> {
	try {
		await callBackend("/admin/user", "POST", values, "Gagal memproses petugas.");
		return { ok: true };
	} catch (err) {
		// Jangan throw: Next.js menyensor pesan error server action di
		// production, sehingga modal hanya menampilkan pesan generik.
		// Kembalikan hasil agar pesan ramah sampai ke form.
		return { ok: false, message: mapCreateOfficerError(err) };
	}
}

export async function deleteOfficer(id: string) {
	await callBackend(`/admin/user/${id}`, "DELETE", undefined, "Gagal memproses petugas.");
}
