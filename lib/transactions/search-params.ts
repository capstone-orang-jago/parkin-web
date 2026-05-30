import type { TransactionFilters, TransactionVehicleFilter } from "./types";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function monthStartISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

/** Parse query URL `/transaksi` — kunci ramah Indonesia. */
export function parseTransactionFilters(
  searchParams: Record<string, string | string[] | undefined>,
): TransactionFilters {
  const get = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const dari = get("dari") ?? monthStartISO();
  const sampai = get("sampai") ?? todayISO();
  const lokasi = get("lokasi") ?? "";
  const petugas = get("petugas") ?? "";
  const kendaraan = (get("kendaraan") ?? "Semua") as TransactionVehicleFilter;
  const status = (get("status") ?? "Semua") as TransactionFilters["status"];

  const vehicle: TransactionVehicleFilter =
    kendaraan === "Motor" || kendaraan === "Mobil" || kendaraan === "Semua"
      ? kendaraan
      : "Semua";

  const statusNorm: TransactionFilters["status"] =
    status === "Sukses" ||
    status === "Gagal" ||
    status === "Semua"
      ? status
      : "Semua";

  return {
    dateFrom: dari,
    dateTo: sampai,
    locationId: lokasi ? lokasi : null,
    officerId: petugas ? petugas : null,
    vehicle,
    status: statusNorm,
  };
}

export function parseTransactionPage(
  searchParams: Record<string, string | string[] | undefined>,
): number {
  const raw = searchParams.halaman;
  const s = Array.isArray(raw) ? raw[0] : raw;
  const n = parseInt(s ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
