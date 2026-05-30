import { formatRp } from "@/lib/format/rp";
import type { ReportLocationPerformance } from "@/lib/reports/types";

export function ReportPerformanceTable({
  rows,
}: {
  rows: ReportLocationPerformance[];
}) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-(--color-border) bg-(--color-surface-2) px-6 py-16 text-center">
        <p className="text-sm font-medium text-(--color-text)">Belum ada data kinerja</p>
        <p className="mt-1 max-w-sm text-sm text-(--color-text-muted)">
          Tidak ada lokasi aktif yang ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-(--color-border) bg-(--color-surface-card)">
      <table className="w-full min-w-160 border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-(--color-border) bg-(--color-surface-offset)">
            <th className="px-4 py-3 text-sm font-semibold text-(--color-text-muted)">Lokasi</th>
            <th className="px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
              Petugas Jaga
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-(--color-text-muted)">
              Transaksi Hari Ini
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-(--color-text-muted)">
              Pendapatan Hari Ini
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.locationName}
              className="border-b border-(--color-divider) transition-colors last:border-b-0 hover:bg-(--color-surface-offset)"
            >
              <td className="px-4 py-3 font-medium text-(--color-text)">{row.locationName}</td>
              <td className="px-4 py-3 text-(--color-text-muted)">
                {row.officersOnDuty || "—"}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-(--color-text)">
                {row.transactionsToday.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 text-right font-medium tabular-nums text-(--color-text)">
                {formatRp(row.revenueTodayRp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
