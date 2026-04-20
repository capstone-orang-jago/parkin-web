import { filterMockTransactionsForReport } from "@/lib/transactions/mock";
import { buildReportPageData } from "./build-report";
import type { ReportFilters, ReportPageData } from "./types";

export async function getReportPageData(filters: ReportFilters): Promise<ReportPageData> {
  const rows = filterMockTransactionsForReport({
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    locationId: filters.locationId,
    vehicle: filters.vehicle === "Semua" ? "Semua" : filters.vehicle,
  });
  return buildReportPageData(filters, rows);
}
