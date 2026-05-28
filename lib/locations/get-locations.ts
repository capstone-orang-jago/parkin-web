import { ACCESS_COOKIE } from "../auth/session-edge";
import { cookies } from "next/headers";
import { buildLocationList, getMockLocationDetail } from "./mock";
import type { ApiLocation, LocationDetail, LocationListItem } from "./types";

/**
 * Daftar lokasi parkir (mock).
 * Nanti: GET /admin/locations.
 */

function mapApiLocationToListItem(item: ApiLocation): LocationListItem {
	return {
		id: item.id,
		name: item.nama_lokasi,
		address: item.alamat,
		activeOfficerLabel: item.petugas ? item.petugas.name : "-",
		status: item.is_active ? "active" : "inactive",
		transactionsToday: 0, // Nanti: hitung dari transaksi hari ini
	};
}

function mapApiLocationToDetail(item: ApiLocation): LocationDetail {
	return {
		id: item.id,
		name: item.nama_lokasi,
		address: item.alamat,
		status: item.is_active ? "active" : "inactive",
		createdAt: new Date().toISOString(),
		assignedOfficerNames: item.petugas ? [item.petugas.name] : [],
		totalTransactions: 0,
		totalRevenueRp: 0,
		avgDailyRp: 0,
		recentTransactions: [],
	};
}

export async function getLocationList(): Promise<LocationListItem[]> {
	const baseUrl = process.env.API_BASE_URL;
	if (!baseUrl) {
		throw new Error("API_BASE_URL belum disetel");
	}

	const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;

	const res = await fetch(`${baseUrl}/admin/locations`, {
		cache: "no-store",
		headers: accessToken
			? {
					Authorization: `Bearer ${accessToken}`,
				}
			: undefined,
	});

	if (!res.ok) {
		throw new Error(`Gagal mengambil lokasi: ${res.status} ${res.statusText}`);
	}

	const payload = await res.json();
	const data: ApiLocation[] = Array.isArray(payload)
		? payload
		: (payload.data ?? []);
	return data.map(mapApiLocationToListItem);
}

export async function getLocationById(
	id: string,
): Promise<LocationDetail | null> {
	const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "") ?? "";
	if (!baseUrl) {
		throw new Error("API_BASE_URL belum diset.");
	}

  const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;

	const res = await fetch(`${baseUrl}/admin/lokasi-parkir/${id}`, {
		cache: "no-store",
		headers: accessToken
			? {
					Authorization: `Bearer ${accessToken}`,
				}
			: undefined,
	});

	if (res.status === 404) return null;
	if (!res.ok) {
		throw new Error("Gagal mengambil detail lokasi.");
	}

	const item: ApiLocation = await res.json();

	return {
		id: item.id,
		name: item.nama_lokasi,
		address: item.alamat,
		status: item.is_active ? "active" : "inactive",
		createdAt: new Date().toISOString(),
		assignedOfficerNames: item.petugas ? [item.petugas.name] : [],
		totalTransactions: 0,
		totalRevenueRp: 0,
		avgDailyRp: 0,
		recentTransactions: [],
	};
}
