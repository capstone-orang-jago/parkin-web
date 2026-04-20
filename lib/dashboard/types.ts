/** Selaras query `?range=` di `/dashboard`. */
export type DashboardRange = "today" | "week" | "month";

export type DashboardSummary = {
  totalTransactions: number;
  totalRevenueRp: number;
  motorCount: number;
  mobilCount: number;
  activeLocations: number;
  activeOfficersToday: number;
};

export type TrendPoint = {
  /** ISO date yyyy-mm-dd */
  date: string;
  /** Label pendek untuk sumbu X */
  label: string;
  transactionCount: number;
  revenueRp: number;
};

export type VehicleType = "Motor" | "Mobil";

export type TransactionStatus = "Sukses" | "Gagal" | "Pending";

export type RecentTransactionRow = {
  id: string;
  time: string;
  locationName: string;
  vehicleType: VehicleType;
  amountRp: number;
  status: TransactionStatus;
};

export type LocationPerformanceRow = {
  locationName: string;
  transactionsToday: number;
  revenueTodayRp: number;
  officersOnDuty: string;
};

export type DashboardData = {
  range: DashboardRange;
  periodLabel: string;
  summary: DashboardSummary;
  trend: TrendPoint[];
  recentTransactions: RecentTransactionRow[];
  locationPerformance: LocationPerformanceRow[];
};
