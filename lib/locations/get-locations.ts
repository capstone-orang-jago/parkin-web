import { fetchWithTokenRetry } from "@/lib/auth/server-api";
import type { ApiTransactionItem } from "@/lib/api/types";
import { normalizeVehicleType, normalizeStatus } from "@/lib/api/normalizers";
import type {
	LocationDetail,
	LocationListItem,
	LocationRecentTransaction,
} from "./types";

type ApiPetugas = {
	id: string;
	name: string;
	email: string;
};

type ApiLocation = {
	alamat: string;
	id: string;
	is_active: boolean;
	nama_lokasi: string;
	petugas: ApiPetugas | null;
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

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapApiLocationToListItem(item: ApiLocation): LocationListItem {
	return {
		id: item.id,
		name: item.nama_lokasi,
		address: item.alamat,
		activeOfficerLabel: item.petugas?.name ?? "—",
		status: item.is_active ? "active" : "inactive",
	};
}

function mapRecentTransaction(item: ApiTransactionItem): LocationRecentTransaction {
	return {
		id: item.id,
		kodeTransaksi: item.kode_transaksi,
		time: item.created_at,
		vehicleType: normalizeVehicleType(item.jenis_kendaraan),
		userName: item.pengguna?.name ?? "-",
		officerName: item.petugas?.name ?? "-",
		amountRp: item.tarif,
		saldoSebelum: item.saldo_sebelum ?? 0,
		saldoSesudah: item.saldo_sesudah ?? 0,
		status: normalizeStatus(item.status),
	};
}

// ---------------------------------------------------------------------------
// Fetch functions
// ---------------------------------------------------------------------------

export async function getLocationList(): Promise<LocationListItem[]> {
	const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
	if (!baseUrl) {
		throw new Error("API_BASE_URL belum disetel.");
	}

	const res = await fetchWithTokenRetry(`${baseUrl}/admin/lokasi-parkir`);

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
	const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
	if (!baseUrl) {
		throw new Error("API_BASE_URL belum disetel.");
	}

	const res = await fetchWithTokenRetry(`${baseUrl}/admin/locations/${id}`);

	if (res.status === 404) return null;
	if (!res.ok) {
		throw new Error(`Gagal mengambil detail lokasi: ${res.status} ${res.statusText}`);
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
		totalTransactions: item.total_transaksi ?? 0,
		totalRevenueRp: item.total_pendapatan ?? 0,
		recentTransactions,
	};
}
