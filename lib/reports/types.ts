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
  topLocationName: string | null;
  topLocationRevenueRp: number;
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
  dailyBars: ReportDailyBar[];
  locationBars: ReportLocationBar[];
  locationTable: ReportLocationRow[];
  /** Baris untuk ekspor CSV (sesuai filter) */
  exportRows: TransactionListItem[];
};
