import { fetchWithTokenRetry } from "@/lib/auth/server-api";
import type { TransactionListItem } from "@/lib/transactions/types";
import type {
	ReportFilters,
	ReportLocationPerformance,
	ReportPageData,
	ReportTrendPoint,
} from "./types";

// ---------------------------------------------------------------------------
// API response types
// ---------------------------------------------------------------------------

type ApiReportBreakdown = {
	location_name: string;
	revenue: number;
	total_tx: number;
};

type ApiReportData = {
	average_per_tx: number;
	breakdown_by_spot: ApiReportBreakdown[] | null;
	total_revenue: number;
	total_tx_global: number;
};

type ApiReportEnvelope = {
	code?: number;
	data?: ApiReportData | null;
	message?: string;
};

type ApiTrendPoint = {
	date: string;
	label: string;
	revenue_rp: number;
	transaction_count: number;
};

type ApiLocationPerformance = {
	location_name: string;
	officers_on_duty: string;
	revenue_today_rp: number;
	transactions_today: number;
};

type ApiDashboardData = {
	location_performance: ApiLocationPerformance[] | null;
	period_label: string;
	range: string;
	recent_transactions: unknown[] | null;
	summary: {
		active_locations: number;
		active_officers_today: number;
		mobil_count: number;
		motor_count: number;
		total_revenue_rp: number;
		total_transactions: number;
	};
	trend: ApiTrendPoint[] | null;
};

type ApiDashboardEnvelope = {
	code?: number;
	data?: ApiDashboardData | null;
	message?: string;
};

type ApiTransactionItem = {
	created_at: string;
	id: string;
	jenis_kendaraan: string;
	kode_transaksi: string;
	lokasi: { id: string; nama_lokasi: string };
	pengguna: { id: string; name: string };
	petugas: { id: string; name: string } | null;
	status: string;
	tarif: number;
};

type ApiTransactionListEnvelope = {
	code?: number;
	data?: {
		items: ApiTransactionItem[] | null;
		total: number;
		page: number;
		limit: number;
	};
	message?: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPeriodLabel(filters: ReportFilters): string {
	const from = new Date(`${filters.dateFrom}T12:00:00.000Z`);
	const to = new Date(`${filters.dateTo}T12:00:00.000Z`);
	const formatter = new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
	return `${formatter.format(from)} – ${formatter.format(to)}`;
}

function inferDashboardRange(
	dateFrom: string,
	dateTo: string,
): "today" | "week" | "month" {
	const diff =
		(new Date(dateTo).getTime() - new Date(dateFrom).getTime()) /
		(1000 * 60 * 60 * 24);
	if (diff <= 1) return "today";
	if (diff <= 7) return "week";
	return "month";
}

function normalizeVehicleType(value: string): TransactionListItem["vehicleType"] {
	const v = value.trim().toLowerCase();
	if (v === "mobil") return "Mobil";
	return "Motor";
}

function normalizeStatus(value: string): TransactionListItem["status"] {
	const v = value.trim().toLowerCase();
	if (v === "gagal") return "Gagal";
	return "Sukses";
}

function mapTransactionItem(item: ApiTransactionItem): TransactionListItem {
	return {
		id: item.id,
		code: item.kode_transaksi,
		time: item.created_at,
		locationId: item.lokasi.id,
		locationName: item.lokasi.nama_lokasi,
		officerId: item.petugas?.id ?? "",
		officerName: item.petugas?.name ?? "-",
		vehicleType: normalizeVehicleType(item.jenis_kendaraan),
		amountRp: item.tarif,
		status: normalizeStatus(item.status),
	};
}

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

async function fetchReportData(
	filters: ReportFilters,
): Promise<ApiReportData | null> {
	const baseUrl = process.env.API_BASE_URL?.trim().replace(/\/$/, "") ?? "";
	if (!baseUrl) return null;

	const url = new URL(`${baseUrl}/admin/reports`);
	url.searchParams.set("date_from", filters.dateFrom);
	url.searchParams.set("date_to", filters.dateTo);
	if (filters.locationId)
		url.searchParams.set("location_id", filters.locationId);
	if (filters.vehicle !== "Semua")
		url.searchParams.set("vehicle", filters.vehicle.toLowerCase());

	const res = await fetchWithTokenRetry(url.toString());
	if (!res.ok) return null;

	const payload = (await res.json()) as ApiReportEnvelope;
	if (
		payload.code !== undefined &&
		payload.code !== 0 &&
		!(payload.code >= 200 && payload.code < 300)
	) {
		return null;
	}

	return payload.data ?? null;
}

async function fetchDashboardData(
	filters: ReportFilters,
): Promise<ApiDashboardData | null> {
	const baseUrl = process.env.API_BASE_URL?.trim().replace(/\/$/, "") ?? "";
	if (!baseUrl) return null;

	const range = inferDashboardRange(filters.dateFrom, filters.dateTo);
	const url = new URL(`${baseUrl}/admin/dashboard`);
	url.searchParams.set("range", range);

	const res = await fetchWithTokenRetry(url.toString());
	if (!res.ok) return null;

	const payload = (await res.json()) as ApiDashboardEnvelope;
	if (
		payload.code !== undefined &&
		payload.code !== 0 &&
		!(payload.code >= 200 && payload.code < 300)
	) {
		return null;
	}

	return payload.data ?? null;
}

async function fetchTransactions(
	filters: ReportFilters,
): Promise<TransactionListItem[]> {
	const baseUrl = process.env.API_BASE_URL?.trim().replace(/\/$/, "") ?? "";
	if (!baseUrl) return [];

	const url = new URL(`${baseUrl}/admin/transactions`);
	url.searchParams.set("date_from", filters.dateFrom);
	url.searchParams.set("date_to", filters.dateTo);
	if (filters.locationId)
		url.searchParams.set("location_id", filters.locationId);
	if (filters.vehicle !== "Semua")
		url.searchParams.set("vehicle", filters.vehicle.toLowerCase());
	url.searchParams.set("limit", "50");
	url.searchParams.set("page", "1");

	const res = await fetchWithTokenRetry(url.toString());
	if (!res.ok) return [];

	const payload = (await res.json()) as ApiTransactionListEnvelope;
	if (
		payload.code !== undefined &&
		payload.code !== 0 &&
		!(payload.code >= 200 && payload.code < 300)
	) {
		return [];
	}

	return Array.isArray(payload.data?.items)
		? payload.data.items.map(mapTransactionItem)
		: [];
}

// ---------------------------------------------------------------------------
// Build page data
// ---------------------------------------------------------------------------

export async function getReportPageData(
	filters: ReportFilters,
): Promise<ReportPageData> {
	const [reportData, dashboardData, transactionItems] = await Promise.all([
		fetchReportData(filters),
		fetchDashboardData(filters),
		fetchTransactions(filters),
	]);

	// Revenue summary from /admin/reports
	const totalRevenue = reportData?.total_revenue ?? 0;
	const totalTransactions = reportData?.total_tx_global ?? 0;
	const averagePerTx = reportData?.average_per_tx ?? 0;

	// Breakdown by spot from /admin/reports
	const breakdown = Array.isArray(reportData?.breakdown_by_spot)
		? reportData.breakdown_by_spot
		: [];
	const sortedBreakdown = [...breakdown].sort((a, b) => b.revenue - a.revenue);
	const topSpot = sortedBreakdown[0] ?? null;

	// Dashboard data: motor/mobil, location performance
	const motorCount = dashboardData?.summary?.motor_count ?? 0;
	const mobilCount = dashboardData?.summary?.mobil_count ?? 0;
	const activeLocations = dashboardData?.summary?.active_locations ?? 0;
	const activeOfficers = dashboardData?.summary?.active_officers_today ?? 0;

	const locationPerformance: ReportLocationPerformance[] = Array.isArray(
		dashboardData?.location_performance,
	)
		? dashboardData.location_performance.map((lp) => ({
				locationName: lp.location_name,
				officersOnDuty: lp.officers_on_duty,
				transactionsToday: lp.transactions_today,
				revenueTodayRp: lp.revenue_today_rp,
			}))
		: [];

	// Build daily bars from dashboard trend data
	const trend: ReportTrendPoint[] = Array.isArray(dashboardData?.trend)
		? dashboardData.trend.map((t) => ({
				date: t.date,
				label: t.label,
				revenueRp: t.revenue_rp,
				transactionCount: t.transaction_count,
			}))
		: [];

	const dailyBars = trend.map((t) => ({
		date: t.date,
		label: t.label,
		revenueRp: t.revenueRp,
	}));

	return {
		filters,
		periodLabel: formatPeriodLabel(filters),
		summary: {
			totalRevenueRp: totalRevenue,
			totalTransactions,
			motorCount,
			mobilCount,
			averagePerTx,
			activeLocations,
			activeOfficers,
			topLocationName: topSpot?.location_name ?? null,
			topLocationRevenueRp: topSpot?.revenue ?? 0,
		},
		trend,
		dailyBars,
		locationBars: sortedBreakdown.map((item, index) => ({
			locationId: `loc-${index + 1}`,
			locationName: item.location_name,
			revenueRp: item.revenue,
		})),
		locationTable: sortedBreakdown.map((item, index) => ({
			locationId: `loc-${index + 1}`,
			locationName: item.location_name,
			transactionCount: item.total_tx,
			motorCount: 0,
			mobilCount: 0,
			totalRevenueRp: item.revenue,
		})),
		locationPerformance,
		exportRows: transactionItems,
	};
}
