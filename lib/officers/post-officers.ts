"use server";

import { getAccessToken } from "@/lib/auth/server-api";
import { callBackend } from "@/lib/api/call-backend";

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

export async function createOfficer(values: OfficerFormValues) {
	await callBackend("/admin/user", "POST", values, "Gagal memproses petugas.");
}

export async function deleteOfficer(id: string) {
	await callBackend(`/admin/user/${id}`, "DELETE", undefined, "Gagal memproses petugas.");
}
