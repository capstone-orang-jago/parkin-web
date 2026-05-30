import type { TransactionStatus, VehicleType } from "@/lib/dashboard/types";

/** Status operasional lokasi (PRD: badge Aktif / Nonaktif). */
export type LocationOperationalStatus = "active" | "inactive";

export type LocationListItem = {
  id: string;
  name: string;
  address: string;
  /** Label tampilan — "—" jika tidak ada petugas aktif */
  activeOfficerLabel: string;
  status: LocationOperationalStatus;
};

export type LocationRecentTransaction = {
  id: string;
  kodeTransaksi: string;
  time: string;
  vehicleType: VehicleType;
  userName: string;
  officerName: string;
  amountRp: number;
  saldoSebelum: number;
  saldoSesudah: number;
  status: TransactionStatus;
};

export type LocationDetail = {
  id: string;
  name: string;
  address: string;
  status: LocationOperationalStatus;
  totalTransactions: number;
  totalRevenueRp: number;
  recentTransactions: LocationRecentTransaction[];
};
