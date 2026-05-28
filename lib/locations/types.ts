import type { TransactionStatus, VehicleType } from "@/lib/dashboard/types";

/** Status operasional lokasi (PRD: badge Aktif / Nonaktif). */
export type LocationOperationalStatus = "active" | "inactive";

export type LocationListItem = {
  id: string;
  name: string;
  address: string;
  /** Label tampilan — kosong jika tidak ada petugas aktif */
  activeOfficerLabel: string;
  status: LocationOperationalStatus;
  transactionsToday: number;
};

export type ApiPetugas = {
  email: string;
  id: string;
  is_verified: boolean;
  lokasi: string;
  name: string;
  password: string;
  role: string;
  saldo: number;
  telephone: string;
};
export type ApiLocation = {
  alamat: string;
  id: string;
  is_active: boolean;
  nama_lokasi: string;
  petugas: ApiPetugas | null;
}

export type LocationRecentTransaction = {
  id: string;
  time: string;
  vehicleType: VehicleType;
  /** Nama petugas dari data transaksi (mock) */
  officerName: string;
  amountRp: number;
  status: TransactionStatus;
};

export type LocationDetail = {
  id: string;
  name: string;
  address: string;
  status: LocationOperationalStatus;
  /** ISO tanggal pembuatan (mock) */
  createdAt: string;
  assignedOfficerNames: string[];
  totalTransactions: number;
  totalRevenueRp: number;
  /** Rata-rata pendapatan harian (mock, Rp) */
  avgDailyRp: number;
  recentTransactions: LocationRecentTransaction[];
};
