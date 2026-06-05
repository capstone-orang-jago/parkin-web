import { fetchWithTokenRetry } from "@/lib/auth/server-api";
import type { ApiTransactionItem, ApiTransactionListEnvelope } from "@/lib/api/types";
import { normalizeVehicleType, normalizeStatus } from "@/lib/api/normalizers";
import type { VehicleType } from "@/lib/dashboard/types";
import type {
	TransactionDetail,
	TransactionFilterOptions,
	TransactionFilters,
	TransactionListItem,
	TransactionListResult,
} from "./types";

type ApiTransactionDetailEnvelope = {
	code: number;
	data: ApiTransactionItem;
	message: string;
};

type ApiTransactionFilterOptionsEnvelope = {
	code: number;
	data: {
		locations: { id: string; name: string }[];
		officers: { id: string; name: string }[];
		statuses: string[];
		vehicles: string[];
	};
	message: string;
};

function maskUserId(id: string) {
	const compact = id.replace(/[^a-z0-9]/gi, "").toUpperCase();
	if (!compact) return "USR-***-***";
	return compact.length <= 4
		? `USR-***-${compact}`
		: `USR-***-${compact.slice(-4)}`;
}

function mapApiTransactionItem(item: ApiTransactionItem): TransactionListItem {
	return {
		id: item.id,
		code: item.kode_transaksi,
		time: item.created_at,
		locationId: item.lokasi.id,
		locationName: item.lokasi.nama_lokasi,
		officerId: item.petugas?.id ?? "",
		officerName: item.petugas?.name ?? "-",
		vehicleType: normalizeVehicleType(
			item.jenis_kendaraan,
			"Semua",
		) as TransactionListItem["vehicleType"],
		amountRp: item.tarif,
		status: normalizeStatus(item.status, "Semua") as TransactionListItem["status"],
	};
}

function mapApiTransactionDetail(item: ApiTransactionItem): TransactionDetail {
	const row = mapApiTransactionItem(item);
	return {
		...row,
		tariffRp: item.tarif,
		userIdMasked: maskUserId(item.pengguna?.id ?? ""),
		userName: item.pengguna?.name ?? "-",
		userEmail: item.pengguna?.email ?? "-",
		balanceBeforeRp: item.saldo_sebelum,
		balanceAfterRp: item.saldo_sesudah,
	};
}

async function callAdminApi<T extends { code?: number; message?: string }>(
	path: string,
): Promise<T> {
	const baseUrl = process.env.API_BASE_URL?.trim().replace(/\/$/, "") ?? "";
	if (!baseUrl) {
		throw new Error("API_BASE_URL belum disetel.");
	}

	const res = await fetchWithTokenRetry(`${baseUrl}${path}`);

	if (!res.ok) {
		if (res.status === 404) {
			throw new Error("NOT_FOUND");
		}
		throw new Error(
			`Gagal mengambil data transaksi: ${res.status} ${res.statusText}`,
		);
	}

	const payload = (await res.json()) as T;
	if (
		payload.code !== undefined &&
		payload.code !== 0 &&
		!(payload.code >= 200 && payload.code < 300)
	) {
		throw new Error(payload.message || "Gagal mengambil data transaksi.");
	}

	return payload;
}

function toQueryString(filters: TransactionFilters, page: number) {
	const params = new URLSearchParams();
	params.set("date_from", filters.dateFrom);
	params.set("date_to", filters.dateTo);
	if (filters.locationId) params.set("location_id", filters.locationId);
	if (filters.officerId) params.set("officer_id", filters.officerId);
	if (filters.vehicle !== "Semua")
		params.set("vehicle", filters.vehicle.toLowerCase());
	if (filters.status !== "Semua")
		params.set("status", filters.status.toLowerCase());
	params.set("page", String(page));
	params.set("limit", "20");
	return params.toString();
}

function buildFilterOptions(
	payload: ApiTransactionFilterOptionsEnvelope,
): TransactionFilterOptions {
	const d = payload.data;
	if (!d) {
		return { locations: [], officers: [], statuses: ["Semua"], vehicles: ["Semua"] };
	}

	const locations = (d.locations ?? []).map((item) => ({
		id: item.id,
		label: item.name,
	}));
	const officers = (d.officers ?? []).map((item) => ({
		id: item.id,
		label: item.name,
	}));

	const statuses: TransactionFilterOptions["statuses"] = ["Semua",
		...(d.statuses ?? []).map((status) => normalizeStatus(status)),
	];
	const vehicles: TransactionFilterOptions["vehicles"] = ["Semua",
		...(d.vehicles ?? [])
			.map((vehicle) => normalizeVehicleType(vehicle, "Semua"))
			.filter((v): v is VehicleType => v !== "Semua"),
	];

	return {
		locations,
		officers,
		statuses,
		vehicles,
	};
}

/**
 * Daftar transaksi dengan filter + pagination.
 * Nanti: GET /admin/transactions + query.
 */
export async function getTransactionList(
	filters: TransactionFilters,
	page: number,
): Promise<TransactionListResult> {
	const payload = await callAdminApi<ApiTransactionListEnvelope>(
		`/admin/transactions?${toQueryString(filters, page)}`,
	);

	return {
		items: Array.isArray(payload.data?.items)
			? payload.data.items.map(mapApiTransactionItem)
			: [],
		total: payload.data?.total ?? 0,
		page: payload.data?.page ?? page,
		pageSize: payload.data?.limit ?? 20,
	};
}

export async function getTransactionDetail(
	id: string,
): Promise<TransactionDetail | null> {
	try {
		const payload = await callAdminApi<ApiTransactionDetailEnvelope>(
			`/admin/transactions/${id}`,
		);
		return mapApiTransactionDetail(payload.data);
	} catch (error) {
		if (error instanceof Error && error.message === "NOT_FOUND") {
			return null;
		}
		throw error;
	}
}

export async function getTransactionFilterOptions(): Promise<TransactionFilterOptions> {
	const payload = await callAdminApi<ApiTransactionFilterOptionsEnvelope>(
		"/admin/transactions/filter-options",
	);

	return buildFilterOptions(payload);
}
