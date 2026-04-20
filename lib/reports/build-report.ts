import type { TransactionListItem } from "@/lib/transactions/types";
import { listMockLocations } from "@/lib/transactions/mock";
import type {
  ReportDailyBar,
  ReportFilters,
  ReportLocationBar,
  ReportLocationRow,
  ReportPageData,
  ReportSummary,
} from "./types";

function revenueRp(row: TransactionListItem): number {
  return row.status === "Sukses" ? row.amountRp : 0;
}

/** Enumerasi tanggal inklusif yyyy-mm-dd */
function eachDateInRange(from: string, to: string): string[] {
  const out: string[] = [];
  const start = new Date(`${from}T12:00:00.000Z`);
  const end = new Date(`${to}T12:00:00.000Z`);
  if (start > end) return [];
  const d = new Date(start);
  while (d <= end) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

function shortDayLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00.000Z`);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(d);
}

function periodLabel(filters: ReportFilters): string {
  const a = new Date(`${filters.dateFrom}T12:00:00.000Z`);
  const b = new Date(`${filters.dateTo}T12:00:00.000Z`);
  const fmt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${fmt.format(a)} – ${fmt.format(b)}`;
}

function buildSummary(rows: TransactionListItem[]): ReportSummary {
  let totalRevenueRp = 0;
  let motorCount = 0;
  let mobilCount = 0;
  const byLoc = new Map<string, { name: string; revenue: number }>();

  for (const r of rows) {
    totalRevenueRp += revenueRp(r);
    if (r.vehicleType === "Motor") motorCount += 1;
    else mobilCount += 1;
    const prev = byLoc.get(r.locationId) ?? {
      name: r.locationName,
      revenue: 0,
    };
    prev.revenue += revenueRp(r);
    byLoc.set(r.locationId, prev);
  }

  let topLocationName: string | null = null;
  let topLocationRevenueRp = 0;
  for (const { name, revenue } of byLoc.values()) {
    if (revenue > topLocationRevenueRp) {
      topLocationRevenueRp = revenue;
      topLocationName = name;
    }
  }

  return {
    totalRevenueRp,
    totalTransactions: rows.length,
    motorCount,
    mobilCount,
    topLocationName,
    topLocationRevenueRp,
  };
}

function buildDailyBars(
  filters: ReportFilters,
  rows: TransactionListItem[],
): ReportDailyBar[] {
  const days = eachDateInRange(filters.dateFrom, filters.dateTo);
  const byDay = new Map<string, number>();
  for (const d of days) byDay.set(d, 0);
  for (const r of rows) {
    const day = r.time.slice(0, 10);
    if (!byDay.has(day)) continue;
    byDay.set(day, (byDay.get(day) ?? 0) + revenueRp(r));
  }
  return days.map((date) => ({
    date,
    label: shortDayLabel(date),
    revenueRp: byDay.get(date) ?? 0,
  }));
}

function buildLocationAggregates(
  rows: TransactionListItem[],
): Map<string, ReportLocationRow> {
  const locs = listMockLocations();
  const map = new Map<string, ReportLocationRow>();
  for (const l of locs) {
    map.set(l.id, {
      locationId: l.id,
      locationName: l.label,
      transactionCount: 0,
      motorCount: 0,
      mobilCount: 0,
      totalRevenueRp: 0,
    });
  }
  for (const r of rows) {
    const cur = map.get(r.locationId);
    if (!cur) continue;
    cur.transactionCount += 1;
    if (r.vehicleType === "Motor") cur.motorCount += 1;
    else cur.mobilCount += 1;
    cur.totalRevenueRp += revenueRp(r);
  }
  return map;
}

export function buildReportPageData(
  filters: ReportFilters,
  rows: TransactionListItem[],
): ReportPageData {
  const summary = buildSummary(rows);
  const dailyBars = buildDailyBars(filters, rows);
  const agg = buildLocationAggregates(rows);
  const locationTable = [...agg.values()].filter((r) => r.transactionCount > 0);
  locationTable.sort((a, b) => b.totalRevenueRp - a.totalRevenueRp);

  const locationBars: ReportLocationBar[] = locationTable.map((r) => ({
    locationId: r.locationId,
    locationName: r.locationName,
    revenueRp: r.totalRevenueRp,
  }));

  return {
    filters,
    periodLabel: periodLabel(filters),
    summary,
    dailyBars,
    locationBars,
    locationTable,
    exportRows: rows,
  };
}
