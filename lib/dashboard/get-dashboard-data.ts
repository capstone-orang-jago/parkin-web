import { fetchWithTokenRetry } from "@/lib/auth/server-api";
import type {
	DashboardData,
	DashboardRange,
	LocationPerformanceRow,
	RecentTransactionRow,
	TrendPoint,
} from "./types";

type ApiTrendPoint = {
	date: string;
	label: string;
	revenue_rp: number;
	transaction_count: number;
};

type ApiRecentTransaction = {
	amount_rp: number;
	id: string;
	location_name: string;
	status: string;
	time: string;
	vehicle_type: string;
};

type ApiLocationPerformance = {
	location_name: string;
	officers_on_duty: string;
	revenue_today_rp: number;
	transactions_today: number;
};

type ApiAdminDashboardData = {
	location_performance: ApiLocationPerformance[] | null;
	period_label: string;
	range: string;
	recent_transactions: ApiRecentTransaction[] | null;
	summary: {
		active_locations: number;
		active_officers: number;
		mobil_count: number;
		motor_count: number;
		total_revenue_rp: number;
		total_transactions: number;
	};
	trend: ApiTrendPoint[] | null;
};

type ApiEnvelope = {
  code?: number;
  success?: boolean;
  data?: ApiAdminDashboardData | null;
  message?: string;
};

function normalizeVehicleType(
	value: string,
): RecentTransactionRow["vehicleType"] {
	const normalized = value.trim().toLowerCase();
	if (normalized === "mobil") return "Mobil";
	return "Motor";
}

function normalizeStatus(value: string): RecentTransactionRow["status"] {
	const normalized = value.trim().toLowerCase();
	if (normalized === "gagal") return "Gagal";
	return "Sukses";
}

async function fetchAdminDashboard(
	range: DashboardRange,
): Promise<DashboardData | null> {
	const baseUrl = process.env.API_BASE_URL?.trim().replace(/\/$/, "") ?? "";
	if (!baseUrl) {
		return null;
	}

	const url = new URL(`${baseUrl}/admin/dashboard`);
	url.searchParams.set("range", range);

	const res = await fetchWithTokenRetry(url.toString());

	if (!res.ok) {
		throw new Error(
			`Gagal mengambil dashboard: ${res.status} ${res.statusText}`,
		);
	}

	const payload = (await res.json()) as ApiEnvelope;
	if (payload.success === false) {
    throw new Error(payload.message || "Gagal mengambil dashboard.");
  }
	if (
		payload.code !== undefined &&
		payload.code !== 0 &&
		!(payload.code >= 200 && payload.code < 300)
	) {
		throw new Error(payload.message || "Gagal mengambil dashboard.");
	}

	const data = payload.data;
	if (!data) {
		return null;
	}

	const trend: TrendPoint[] = Array.isArray(data.trend)
		? data.trend.map((item) => ({
				date: item.date,
				label: item.label,
				revenueRp: item.revenue_rp,
				transactionCount: item.transaction_count,
			}))
		: [];

	const recentTransactions: RecentTransactionRow[] = Array.isArray(
		data.recent_transactions,
	)
		? data.recent_transactions.map((item) => ({
				id: item.id,
				time: item.time,
				locationName: item.location_name,
				vehicleType: normalizeVehicleType(item.vehicle_type),
				amountRp: item.amount_rp,
				status: normalizeStatus(item.status),
			}))
		: [];

	const locationPerformance: LocationPerformanceRow[] = Array.isArray(
		data.location_performance,
	)
		? data.location_performance.map((item) => ({
				locationName: item.location_name,
				transactions: item.transactions_today,
				revenueRp: item.revenue_today_rp,
				officersOnDuty: item.officers_on_duty,
			}))
		: [];

	const rangeValue =
		data.range === "today" || data.range === "week" || data.range === "month"
			? data.range
			: range;

	return {
		range: rangeValue,
		periodLabel: data.period_label || "",
		summary: {
			totalTransactions: data.summary?.total_transactions ?? 0,
			totalRevenueRp: data.summary?.total_revenue_rp ?? 0,
			motorCount: data.summary?.motor_count ?? 0,
			mobilCount: data.summary?.mobil_count ?? 0,
			activeLocations: data.summary?.active_locations ?? 0,
			activeOfficers: data.summary?.active_officers ?? 0,
		},
		trend,
		recentTransactions,
		locationPerformance,
	};
}

export async function getDashboardData(
	range: DashboardRange,
): Promise<DashboardData> {
	const remote = await fetchAdminDashboard(range);
	if (remote) {
		return remote;
	}

	throw new Error("Gagal mengambil data dashboard dari backend.");
}

export function parseDashboardRange(
	value: string | string[] | undefined,
): DashboardRange {
	const v = Array.isArray(value) ? value[0] : value;
	if (v === "week" || v === "month") return v;
	return "today";
}
