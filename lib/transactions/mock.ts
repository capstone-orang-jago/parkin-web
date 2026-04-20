import type { TransactionStatus, VehicleType } from "@/lib/dashboard/types";
import type {
  FilterOption,
  TransactionDetail,
  TransactionFilters,
  TransactionListItem,
  TransactionListResult,
} from "./types";

const PAGE_SIZE = 20;

const LOCATIONS: FilterOption[] = [
  { id: "loc-1", label: "Lapangan Merdeka" },
  { id: "loc-2", label: "Jembatan Kuning" },
  { id: "loc-3", label: "Mantikulore" },
  { id: "loc-4", label: "Tondo" },
  { id: "loc-5", label: "Kawatuna" },
];

const OFFICERS: FilterOption[] = [
  { id: "off-1", label: "Ahmad Faisal" },
  { id: "off-2", label: "Budi Santoso" },
  { id: "off-3", label: "Citra Lestari" },
  { id: "off-4", label: "Dewi Anggraini" },
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

/** Pool deterministik ~240 transaksi mock. */
function allMockRows(): TransactionListItem[] {
  const rows: TransactionListItem[] = [];
  const statuses: TransactionStatus[] = [
    "Sukses",
    "Sukses",
    "Sukses",
    "Pending",
    "Gagal",
  ];

  for (let i = 0; i < 240; i++) {
    const loc = LOCATIONS[i % LOCATIONS.length];
    const off = OFFICERS[i % OFFICERS.length];
    const motor = i % 3 !== 0;
    const vt: VehicleType = motor ? "Motor" : "Mobil";
    const status = statuses[hash(`st-${i}`) % statuses.length];
    const t = new Date();
    t.setDate(t.getDate() - (i % 45));
    t.setHours(7 + (i % 12), (i * 7) % 60, 0, 0);
    const id = `trx-${i + 1}`;
    const code = `TRX-2025-${String(10000 + i).slice(1)}`;
    rows.push({
      id,
      code,
      time: t.toISOString(),
      locationId: loc.id,
      locationName: loc.label,
      officerId: off.id,
      officerName: off.label,
      vehicleType: vt,
      amountRp: 2000 + (i % 8) * 500,
      status,
    });
  }
  return rows;
}

const POOL = allMockRows();

function matches(row: TransactionListItem, f: TransactionFilters): boolean {
  const day = row.time.slice(0, 10);
  if (day < f.dateFrom || day > f.dateTo) return false;
  if (f.locationId && row.locationId !== f.locationId) return false;
  if (f.officerId && row.officerId !== f.officerId) return false;
  if (f.vehicle !== "Semua" && row.vehicleType !== f.vehicle) return false;
  if (f.status !== "Semua" && row.status !== f.status) return false;
  return true;
}

export function listMockLocations(): FilterOption[] {
  return LOCATIONS;
}

export function listMockOfficers(): FilterOption[] {
  return OFFICERS;
}

export function buildMockTransactionList(
  filters: TransactionFilters,
  page: number,
): TransactionListResult {
  const filtered = POOL.filter((r) => matches(r, filters)).sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );
  const total = filtered.length;
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);
  return {
    items,
    total,
    page: safePage,
    pageSize: PAGE_SIZE,
  };
}

function detailFromRow(row: TransactionListItem): TransactionDetail {
  const h = hash(row.id);
  return {
    ...row,
    tariffRp: row.amountRp,
    userIdMasked: `USR-***-${String(500 + (h % 900)).slice(-3)}`,
    balanceBeforeRp: 45_000 + (h % 20) * 1000,
    balanceAfterRp: 45_000 + (h % 20) * 1000 - row.amountRp,
  };
}

export function getMockTransactionById(
  id: string,
): TransactionDetail | null {
  const row = POOL.find((r) => r.id === id);
  if (!row) return null;
  return detailFromRow(row);
}

/** Untuk modul lokasi: transaksi terbaru per lokasi (sumber data sama dengan pool). */
export function getMockTransactionsForLocation(
  locationId: string,
  limit: number,
): TransactionListItem[] {
  return POOL.filter((r) => r.locationId === locationId)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, limit);
}

export function countMockTransactionsTodayForLocation(locationId: string): number {
  const today = new Date().toISOString().slice(0, 10);
  return POOL.filter(
    (r) => r.locationId === locationId && r.time.slice(0, 10) === today,
  ).length;
}

export function aggregateMockStatsForLocation(locationId: string): {
  totalTransactions: number;
  totalRevenueRp: number;
} {
  const rows = POOL.filter((r) => r.locationId === locationId);
  const totalRevenueRp = rows.reduce((s, r) => s + r.amountRp, 0);
  return {
    totalTransactions: rows.length,
    totalRevenueRp,
  };
}

/** Untuk modul petugas: transaksi terbaru per petugas. */
export function getMockTransactionsForOfficer(
  officerId: string,
  limit: number,
): TransactionListItem[] {
  return POOL.filter((r) => r.officerId === officerId)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, limit);
}

export function countMockTransactionsTodayForOfficer(officerId: string): number {
  const today = new Date().toISOString().slice(0, 10);
  return POOL.filter(
    (r) => r.officerId === officerId && r.time.slice(0, 10) === today,
  ).length;
}

export function aggregateMockStatsForOfficer(officerId: string): {
  totalTransactions: number;
  totalRevenueRp: number;
} {
  const rows = POOL.filter((r) => r.officerId === officerId);
  const totalRevenueRp = rows.reduce((s, r) => s + r.amountRp, 0);
  return {
    totalTransactions: rows.length,
    totalRevenueRp,
  };
}

/** Filter pool untuk halaman laporan (tanpa filter status/petugas). */
export function filterMockTransactionsForReport(params: {
  dateFrom: string;
  dateTo: string;
  locationId: string | null;
  vehicle: "Semua" | "Motor" | "Mobil";
}): TransactionListItem[] {
  return POOL.filter((row) => {
    const day = row.time.slice(0, 10);
    if (day < params.dateFrom || day > params.dateTo) return false;
    if (params.locationId && row.locationId !== params.locationId) return false;
    if (params.vehicle !== "Semua" && row.vehicleType !== params.vehicle) {
      return false;
    }
    return true;
  }).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}

export { PAGE_SIZE };
