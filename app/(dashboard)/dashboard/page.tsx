import type { Metadata } from "next";
import { DashboardRangeTabs } from "@/components/dashboard/dashboard-range-tabs";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { LocationPerformanceTable } from "@/components/dashboard/location-performance-table";
import { RecentTransactionsTable } from "@/components/dashboard/recent-transactions-table";
import { TrendChart } from "@/components/dashboard/trend-chart";
import {
  getDashboardData,
  parseDashboardRange,
} from "@/lib/dashboard/get-dashboard-data";

export const metadata: Metadata = {
  title: "Dashboard",
};

type PageProps = {
  searchParams: Promise<{ range?: string }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const range = parseDashboardRange(sp.range);
  const data = await getDashboardData(range);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-(--color-text)">
            Ringkasan operasional
          </h2>
          <p className="text-sm text-(--color-text-muted)">
            Pantau transaksi dan pendapatan — periode:{" "}
            <span className="font-medium text-(--color-text)">{data.periodLabel}</span>
          </p>
        </div>
        <DashboardRangeTabs current={range} />
      </header>

      <KpiGrid summary={data.summary} periodLabel={data.periodLabel} />

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-megalit-900">
          Tren 7 hari terakhir
        </h3>
        <p className="text-xs text-megalit-600">
          Garis oranye: jumlah transaksi. Garis teal: pendapatan (sumbu kanan).
        </p>
        <TrendChart data={data.trend} />
      </section>

      <div className="grid gap-6 lg:grid-cols-1">
        <RecentTransactionsTable rows={data.recentTransactions} />
        <LocationPerformanceTable rows={data.locationPerformance} />
      </div>
    </div>
  );
}
