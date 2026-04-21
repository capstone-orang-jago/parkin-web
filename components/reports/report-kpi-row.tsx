import { formatRp } from "@/lib/format/rp";
import type { ReportSummary } from "@/lib/reports/types";

export function ReportKpiRow({ summary }: { summary: ReportSummary }) {
  const cards = [
    {
      label: "Total pendapatan",
      value: formatRp(summary.totalRevenueRp),
      sub: "Transaksi sukses",
    },
    {
      label: "Total transaksi",
      value: summary.totalTransactions.toLocaleString("id-ID"),
      sub: "Semua status",
    },
    {
      label: "Motor",
      value: summary.motorCount.toLocaleString("id-ID"),
      sub: "Volume kendaraan",
    },
    {
      label: "Mobil",
      value: summary.mobilCount.toLocaleString("id-ID"),
      sub: "Volume kendaraan",
    },
    {
      label: "Lokasi tertinggi",
      value: summary.topLocationName ?? "—",
      sub:
        summary.topLocationRevenueRp > 0
          ? formatRp(summary.topLocationRevenueRp)
          : "Pendapatan sukses",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-lg border border-(--color-border) bg-(--color-surface-card) p-4 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
            {c.label}
          </p>
          <p className="mt-2 text-xl font-bold tabular-nums text-(--color-text)">{c.value}</p>
          <p className="mt-1 text-xs text-(--color-text-faint)">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
