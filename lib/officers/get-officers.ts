import { fetchWithTokenRetry } from "@/lib/auth/server-api";
import type {
	OfficerDetail,
	OfficerListItem,
	OfficerRecentTransaction,
} from "./types";

type ApiOfficer = {
	email: string;
	id: string;
	is_verified: boolean;
	lokasi: {
		alamat: string;
		id: string;
		is_active: boolean;
		nama_lokasi: string;
		petugas: string;
	} | null;
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

type ApiTransactionItem = {
	created_at: string;
	id: string;
	jenis_kendaraan: string;
	kode_transaksi: string;
	lokasi: { nama_lokasi: string };
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
	if (v === "pending") return "Pending";
	return "Sukses";
}

function mapApiOfficerToListItem(item: ApiOfficer): OfficerListItem {
	return {
		id: item.id,
		fullName: item.name,
		phone: item.telephone,
		assignedLocationName: item.lokasi?.nama_lokasi ?? "—",
		status: item.is_verified ? "active" : "inactive",
		transactionsToday: 0,
	};
}

function mapRecentTransaction(item: ApiTransactionItem): OfficerRecentTransaction {
	return {
		id: item.id,
		time: item.created_at,
		locationName: item.lokasi?.nama_lokasi ?? "-",
		vehicleType: normalizeVehicleType(item.jenis_kendaraan),
		amountRp: item.tarif,
		status: normalizeStatus(item.status),
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

export async function getOfficerById(
	id: string,
): Promise<OfficerDetail | null> {
	const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
	if (!baseUrl) {
		throw new Error("API_BASE_URL belum disetel.");
	}

	const res = await fetchWithTokenRetry(`${baseUrl}/admin/officers/${id}`);

	if (res.status === 404) return null;
	if (!res.ok) {
		throw new Error(`Gagal mengambil detail petugas: ${res.status} ${res.statusText}`);
	}

	const payload = await res.json();
	const item: ApiOfficerDetail = payload.data ?? payload;

	const recentTransactions = Array.isArray(item.history_handled)
		? item.history_handled.map(mapRecentTransaction)
		: [];

	return {
		id: item.id,
		fullName: item.name,
		phone: item.telephone,
		officerCode: `PET-${item.id.slice(-3).toUpperCase()}`,
		status: "active",
		assignedLocationId: null,
		assignedLocationName: null,
		totalTransactions: item.total_tx_handled ?? 0,
		totalRevenueRp: 0,
		assignmentHistory: [],
		recentTransactions,
	};
}
