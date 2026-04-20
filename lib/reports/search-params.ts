import type { TransactionVehicleFilter } from "@/lib/transactions/types";
import type { ReportFilters } from "./types";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function defaultFromISO() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Parse query `/laporan`: dari, sampai, lokasi, kendaraan */
export function parseReportFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ReportFilters {
  const get = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v;
  };

  let dari = get("dari") ?? defaultFromISO();
  let sampai = get("sampai") ?? todayISO();
  if (dari > sampai) {
    [dari, sampai] = [sampai, dari];
  }

  const lokasi = get("lokasi") ?? "";
  const kendaraan = (get("kendaraan") ?? "Semua") as TransactionVehicleFilter;
  const vehicle: TransactionVehicleFilter =
    kendaraan === "Motor" || kendaraan === "Mobil" || kendaraan === "Semua"
      ? kendaraan
      : "Semua";

  return {
    dateFrom: dari,
    dateTo: sampai,
    locationId: lokasi ? lokasi : null,
    vehicle,
  };
}
