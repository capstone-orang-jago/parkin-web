import type { TransactionStatus, VehicleType } from "@/lib/dashboard/types";

export type OfficerListItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
};

export type OfficerRecentTransaction = {
  id: string;
  transactionCode: string;
  time: string;
  locationName: string;
  vehicleType: VehicleType;
  amountRp: number;
  status: TransactionStatus;
  pengguna: { id: string; name: string; email: string } | null;
};

export type OfficerDetail = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  /** Kode tampilan admin, mis. PK-550E8400 */
  officerCode: string;
  assignedLocationId: string | null;
  assignedLocationName: string | null;
  totalDutyDays: number;
  totalTransactions: number;
  recentTransactions: OfficerRecentTransaction[];
};
