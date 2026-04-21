import { formatRp } from "@/lib/format/rp";
import type { ReportLocationRow } from "@/lib/reports/types";

export function ReportLocationTable({ rows }: { rows: ReportLocationRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-(--color-border) bg-(--color-surface-2) px-6 py-16 text-center">
        <p className="text-sm font-medium text-(--color-text)">Belum ada rekap lokasi</p>
        <p className="mt-1 max-w-sm text-sm text-(--color-text-muted)">
          Sesuaikan rentang tanggal atau filter untuk melihat data.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-(--color-border) bg-(--color-surface-card)">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-(--color-border) bg-(--color-surface-offset)">
            <th className="px-4 py-3 text-sm font-semibold text-(--color-text-muted)">Lokasi</th>
            <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-(--color-text-muted)">
              Jumlah transaksi
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-(--color-text-muted)">
              Motor
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-(--color-text-muted)">
              Mobil
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-(--color-text-muted)">
              Total pendapatan
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.locationId}
              className="border-b border-(--color-divider) transition-colors last:border-b-0 hover:bg-(--color-surface-offset)"
            >
              <td className="px-4 py-3 font-medium text-(--color-text)">{row.locationName}</td>
              <td className="px-4 py-3 text-right tabular-nums text-(--color-text)">
                {row.transactionCount.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-(--color-text-muted)">
                {row.motorCount.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-(--color-text-muted)">
                {row.mobilCount.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 text-right font-medium tabular-nums text-(--color-text)">
                {formatRp(row.totalRevenueRp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
