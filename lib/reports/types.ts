import type { TransactionListItem, TransactionVehicleFilter } from "@/lib/transactions/types";

export type ReportFilters = {
  dateFrom: string;
  dateTo: string;
  locationId: string | null;
  vehicle: TransactionVehicleFilter;
};

export type ReportSummary = {
  totalRevenueRp: number;
  totalTransactions: number;
  motorCount: number;
  mobilCount: number;
  averagePerTx: number;
  activeLocations: number;
  activeOfficers: number;
  topLocationName: string | null;
  topLocationRevenueRp: number;
};

export type ReportTrendPoint = {
  date: string;
  label: string;
  revenueRp: number;
  transactionCount: number;
};

export type ReportLocationPerformance = {
  locationName: string;
  officersOnDuty: string;
  transactionsToday: number;
  revenueTodayRp: number;
};

export type ReportDailyBar = {
  date: string;
  label: string;
  revenueRp: number;
};

export type ReportLocationBar = {
  locationId: string;
  locationName: string;
  revenueRp: number;
};

export type ReportLocationRow = {
  locationId: string;
  locationName: string;
  transactionCount: number;
  motorCount: number;
  mobilCount: number;
  totalRevenueRp: number;
};

export type ReportPageData = {
  filters: ReportFilters;
  /** Label periode untuk header */
  periodLabel: string;
  summary: ReportSummary;
  trend: ReportTrendPoint[];
  dailyBars: ReportDailyBar[];
  locationBars: ReportLocationBar[];
  locationTable: ReportLocationRow[];
  locationPerformance: ReportLocationPerformance[];
  /** Baris untuk ekspor CSV (sesuai filter) */
  exportRows: TransactionListItem[];
};
