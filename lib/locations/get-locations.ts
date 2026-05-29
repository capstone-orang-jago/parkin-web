import { fetchWithTokenRetry } from "@/lib/auth/server-api";
import type {
	ApiLocation,
	LocationDetail,
	LocationListItem,
	LocationRecentTransaction,
} from "./types";

/**
 * Daftar lokasi parkir.
 */

function mapApiLocationToListItem(item: ApiLocation): LocationListItem {
	return {
		id: item.id,
		name: item.nama_lokasi,
		address: item.alamat,
		activeOfficerLabel: item.petugas ? item.petugas.name : "-",
		status: item.is_active ? "active" : "inactive",
		transactionsToday: 0,
	};
}

type ApiTransactionItem = {
	created_at: string;
	id: string;
	jenis_kendaraan: string;
	kode_transaksi: string;
	lokasi: { nama_lokasi: string };
	pengguna: { name: string };
	status: string;
	tarif: number;
};

type ApiLocationDetail = {
	alamat: string;
	id: string;
	is_active: boolean;
	nama_lokasi: string;
	recent_history: ApiTransactionItem[] | null;
	total_pendapatan: number;
	total_transaksi: number;
};

function normalizeVehicleType(
	value: string,
): LocationRecentTransaction["vehicleType"] {
	const v = value.trim().toLowerCase();
	if (v === "mobil") return "Mobil";
	return "Motor";
}

function normalizeStatus(
	value: string,
): LocationRecentTransaction["status"] {
	const v = value.trim().toLowerCase();
	if (v === "gagal") return "Gagal";
	if (v === "pending") return "Pending";
	return "Sukses";
}

function mapRecentTransaction(item: ApiTransactionItem): LocationRecentTransaction {
	return {
		id: item.id,
		time: item.created_at,
		vehicleType: normalizeVehicleType(item.jenis_kendaraan),
		officerName: item.pengguna?.name ?? "-",
		amountRp: item.tarif,
		status: normalizeStatus(item.status),
	};
}

export async function getLocationList(): Promise<LocationListItem[]> {
	const baseUrl = process.env.API_BASE_URL;
	if (!baseUrl) {
		throw new Error("API_BASE_URL belum disetel");
	}

	const res = await fetchWithTokenRetry(`${baseUrl}/admin/locations`);

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

	// Gunakan /admin/locations/{id} yang mengembalikan AdminLocationDetailDTO dengan stats
	const res = await fetchWithTokenRetry(`${baseUrl}/admin/locations/${id}`);

	if (res.status === 404) return null;
	if (!res.ok) {
		throw new Error("Gagal mengambil detail lokasi.");
	}

	const payload = await res.json();
	const item: ApiLocationDetail = payload.data ?? payload;

	const recentTransactions = Array.isArray(item.recent_history)
		? item.recent_history.map(mapRecentTransaction)
		: [];

	return {
		id: item.id,
		name: item.nama_lokasi,
		address: item.alamat,
		status: item.is_active ? "active" : "inactive",
		createdAt: new Date().toISOString(),
		assignedOfficerNames: [],
		totalTransactions: item.total_transaksi ?? 0,
		totalRevenueRp: item.total_pendapatan ?? 0,
		avgDailyRp: 0,
		recentTransactions,
	};
}
