import { fetchWithTokenRetry } from "@/lib/auth/server-api";
import type { ReportFilters, ReportPageData } from "./types";

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

function buildRemoteReportPageData(
	filters: ReportFilters,
	data: ApiReportData,
): ReportPageData {
	const breakdown = Array.isArray(data.breakdown_by_spot)
		? data.breakdown_by_spot
		: [];
	const sortedBreakdown = [...breakdown].sort((a, b) => b.revenue - a.revenue);
	const topSpot = sortedBreakdown[0] ?? null;

	return {
		filters,
		periodLabel: formatPeriodLabel(filters),
		summary: {
			totalRevenueRp: data.total_revenue ?? 0,
			totalTransactions: data.total_tx_global ?? 0,
			motorCount: 0,
			mobilCount: 0,
			topLocationName: topSpot?.location_name ?? null,
			topLocationRevenueRp: topSpot?.revenue ?? 0,
		},
		dailyBars: [],
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
		exportRows: [],
	};
}

async function fetchReportData(
	filters: ReportFilters,
): Promise<ReportPageData | null> {
	const baseUrl = process.env.API_BASE_URL?.trim().replace(/\/$/, "") ?? "";
	if (!baseUrl) {
		return null;
	}

	const url = new URL(`${baseUrl}/admin/reports`);
	url.searchParams.set("date_from", filters.dateFrom);
	url.searchParams.set("date_to", filters.dateTo);
	if (filters.locationId)
		url.searchParams.set("location_id", filters.locationId);
	if (filters.vehicle !== "Semua")
		url.searchParams.set("vehicle", filters.vehicle.toLowerCase());

	const res = await fetchWithTokenRetry(url.toString());

	if (!res.ok) {
		throw new Error(`Gagal mengambil laporan: ${res.status} ${res.statusText}`);
	}

	const payload = (await res.json()) as ApiReportEnvelope;
	if (
		payload.code !== undefined &&
		payload.code !== 0 &&
		!(payload.code >= 200 && payload.code < 300)
	) {
		throw new Error(payload.message || "Gagal mengambil laporan.");
	}

	if (!payload.data) {
		return null;
	}

	return buildRemoteReportPageData(filters, payload.data);
}

export async function getReportPageData(
	filters: ReportFilters,
): Promise<ReportPageData> {
	const remote = await fetchReportData(filters);
	if (remote) {
		return remote;
	}

	throw new Error("Gagal mengambil data laporan dari backend.");
}
