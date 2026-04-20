import type { Metadata } from "next";
import { ReportCharts } from "@/components/reports/report-charts";
import { ReportExportButtons } from "@/components/reports/report-export-buttons";
import { ReportFiltersBar } from "@/components/reports/report-filters-bar";
import { ReportKpiRow } from "@/components/reports/report-kpi-row";
import { ReportLocationTable } from "@/components/reports/report-location-table";
import { getReportPageData } from "@/lib/reports/get-report";
import { parseReportFilters } from "@/lib/reports/search-params";
import { listMockLocations } from "@/lib/transactions/mock";

export const metadata: Metadata = {
  title: "Laporan",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LaporanPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filters = parseReportFilters(sp);
  const [data, locations] = await Promise.all([
    getReportPageData(filters),
    Promise.resolve(listMockLocations()),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="text-lg font-bold text-(--color-text)">Laporan</h2>
        <p className="mt-1 text-sm text-(--color-text-muted)">
          Rekap pendapatan dan volume kendaraan — periode:{" "}
          <span className="font-medium text-(--color-text)">{data.periodLabel}</span>
        </p>
      </header>

      <ReportFiltersBar filters={filters} locations={locations} />

      <ReportKpiRow summary={data.summary} />

      <ReportCharts dailyBars={data.dailyBars} locationBars={data.locationBars} />

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-(--color-text)">Rekap per lokasi</h3>
        <ReportLocationTable rows={data.locationTable} />
      </section>

      <section className="flex flex-col gap-3 border-t border-(--color-border) pt-6">
        <h3 className="text-sm font-semibold text-(--color-text)">Ekspor data</h3>
        <p className="text-xs text-(--color-text-muted)">
          CSV memuat detail transaksi sesuai filter aktif (kode, waktu, lokasi, kendaraan, nominal,
          status).
        </p>
        <ReportExportButtons
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          rows={data.exportRows}
        />
      </section>
    </div>
  );
}
