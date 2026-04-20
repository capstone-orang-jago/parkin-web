import type { TransactionFilters } from "./types";

/** Query string untuk `/transaksi` (tanpa `?`). */
export function transactionQueryString(
  filters: TransactionFilters,
  page: number,
): string {
  const p = new URLSearchParams();
  p.set("dari", filters.dateFrom);
  p.set("sampai", filters.dateTo);
  if (filters.locationId) p.set("lokasi", filters.locationId);
  if (filters.officerId) p.set("petugas", filters.officerId);
  if (filters.vehicle !== "Semua") p.set("kendaraan", filters.vehicle);
  if (filters.status !== "Semua") p.set("status", filters.status);
  if (page > 1) p.set("halaman", String(page));
  return p.toString();
}
