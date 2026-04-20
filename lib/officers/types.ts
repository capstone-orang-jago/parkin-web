import type { TransactionStatus, VehicleType } from "@/lib/dashboard/types";

export type OfficerAccountStatus = "active" | "inactive";

export type OfficerListItem = {
  id: string;
  fullName: string;
  phone: string;
  assignedLocationName: string;
  status: OfficerAccountStatus;
  /** Jumlah transaksi hari ini (QR / pembayaran yang ditangani) — mock */
  transactionsToday: number;
};

export type OfficerAssignmentHistoryItem = {
  locationName: string;
  /** ISO tanggal mulai */
  startDate: string;
  /** ISO tanggal selesai; null = masih berlangsung */
  endDate: string | null;
};

export type OfficerRecentTransaction = {
  id: string;
  time: string;
  locationName: string;
  vehicleType: VehicleType;
  amountRp: number;
  status: TransactionStatus;
};

export type OfficerDetail = {
  id: string;
  fullName: string;
  phone: string;
  /** Kode tampilan admin, mis. PET-088 */
  officerCode: string;
  status: OfficerAccountStatus;
  assignedLocationId: string | null;
  assignedLocationName: string | null;
  totalTransactions: number;
  totalRevenueRp: number;
  assignmentHistory: OfficerAssignmentHistoryItem[];
  recentTransactions: OfficerRecentTransaction[];
};
