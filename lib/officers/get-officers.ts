import { fetchWithTokenRetry } from "@/lib/auth/server-api";
import type {
	OfficerDetail,
	OfficerListItem,
	OfficerRecentTransaction,
} from "./types";

// ---------------------------------------------------------------------------
// API response types — mirrors dto.UserResponseDTO from swagger.yaml
// (returned by GET /admin/officers)
// ---------------------------------------------------------------------------

type ApiLokasiParkir = {
	alamat: string;
	id: string;
	is_active: boolean;
	nama_lokasi: string;
	petugas: ApiOfficer | null;
};

type ApiOfficer = {
	email: string;
	id: string;
	is_verified: boolean;
	lokasi: ApiLokasiParkir | null;
	name: string;
	password: string;
	role: string;
	saldo: number;
	telephone: string;
};

type ApiOfficerListResponse = {
	code: number;
	data: ApiOfficer[];
	message: string;
};

// ---------------------------------------------------------------------------
// API response types — mirrors dto.AdminOfficerDetailDTO from swagger.yaml
// (returned by GET /admin/officers/{id})
// ---------------------------------------------------------------------------

type ApiPengguna = {
	id: string;
	name: string;
	email: string;
};

type ApiTransactionItem = {
	created_at: string;
	id: string;
	jenis_kendaraan: string;
	kode_transaksi: string;
	lokasi: { nama_lokasi: string };
	pengguna: ApiPengguna | null;
	petugas: { id: string; name: string; email: string } | null;
	saldo_sebelum: number;
	saldo_sesudah: number;
	status: string;
	tarif: number;
};

type ApiOfficerDetail = {
	email: string;
	history_handled: ApiTransactionItem[] | null;
	id: string;
	name: string;
	telephone: string;
	total_duty_days: number;
	total_tx_handled: number;
};

function normalizeVehicleType(
	value: string,
): OfficerRecentTransaction["vehicleType"] {
	const v = value.trim().toLowerCase();
	if (v === "mobil") return "Mobil";
	return "Motor";
}

function normalizeStatus(
	value: string,
): OfficerRecentTransaction["status"] {
	const v = value.trim().toLowerCase();
	if (v === "gagal") return "Gagal";
	return "Sukses";
}

function mapApiOfficerToListItem(item: ApiOfficer): OfficerListItem {
	return {
		id: item.id,
		fullName: item.name,
		email: item.email,
		phone: item.telephone,
	};
}

function mapRecentTransaction(item: ApiTransactionItem): OfficerRecentTransaction {
	return {
		id: item.id,
		transactionCode: item.kode_transaksi,
		time: item.created_at,
		locationName: item.lokasi?.nama_lokasi ?? "-",
		vehicleType: normalizeVehicleType(item.jenis_kendaraan),
		amountRp: item.tarif,
		status: normalizeStatus(item.status),
		pengguna: item.pengguna ?? null,
	};
}

export async function getOfficerList(): Promise<OfficerListItem[]> {
	const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
	if (!baseUrl) {
		throw new Error("API_BASE_URL belum disetel.");
	}

	const res = await fetchWithTokenRetry(`${baseUrl}/admin/officers`);

	if (!res.ok) {
		throw new Error(`Gagal mengambil petugas: ${res.status} ${res.statusText}`);
	}

	const payload = (await res.json()) as ApiOfficerListResponse | ApiOfficer[];
	const data = Array.isArray(payload)
		? payload
		: Array.isArray(payload.data)
			? payload.data
			: [];

	return data.map(mapApiOfficerToListItem);
}

async function fetchOfficerLocation(
	baseUrl: string,
	officerId: string,
): Promise<{ id: string; name: string } | null> {
	try {
		const res = await fetchWithTokenRetry(
			`${baseUrl}/admin/lokasi-parkir/petugas/${officerId}`,
		);
		if (!res.ok) return null;

		const payload = await res.json();
		const lokasi: ApiLokasiParkir = payload.data ?? payload;
		if (!lokasi?.id) return null;

		return { id: lokasi.id, name: lokasi.nama_lokasi };
	} catch {
		return null;
	}
}

export async function getOfficerById(
	id: string,
): Promise<OfficerDetail | null> {
	const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
	if (!baseUrl) {
		throw new Error("API_BASE_URL belum disetel.");
	}

	const [detailRes, location] = await Promise.all([
		fetchWithTokenRetry(`${baseUrl}/admin/officers/${id}`),
		fetchOfficerLocation(baseUrl, id),
	]);

	if (detailRes.status === 404) return null;
	if (!detailRes.ok) {
		throw new Error(`Gagal mengambil detail petugas: ${detailRes.status} ${detailRes.statusText}`);
	}

	const payload = await detailRes.json();
	const item: ApiOfficerDetail = payload.data ?? payload;

	const recentTransactions = Array.isArray(item.history_handled)
		? item.history_handled.map(mapRecentTransaction)
		: [];

	return {
		id: item.id,
		fullName: item.name,
		email: item.email,
		phone: item.telephone,
		officerCode: `PET-${item.id.slice(-3).toUpperCase()}`,
		assignedLocationId: location?.id ?? null,
		assignedLocationName: location?.name ?? null,
		totalDutyDays: item.total_duty_days ?? 0,
		totalTransactions: item.total_tx_handled ?? 0,
		recentTransactions,
	};
}
