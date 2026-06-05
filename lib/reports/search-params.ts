import type { TransactionVehicleFilter } from "@/lib/transactions/types";
import { todayISO, daysAgoISO } from "@/lib/date";
import type { ReportFilters } from "./types";

/** Parse query `/laporan`: dari, sampai, lokasi, kendaraan */
export function parseReportFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ReportFilters {
  const get = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v;
  };

  let dari = get("dari") ?? daysAgoISO(30);
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
