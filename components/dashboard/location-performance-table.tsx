import type { LocationPerformanceRow } from "@/lib/dashboard/types";
import { formatRp } from "@/lib/format/rp";

export function LocationPerformanceTable({ rows }: { rows: LocationPerformanceRow[] }) {
  return (
    <section className="rounded-lg border border-megalit-200 bg-(--color-surface-card) shadow-sm">
      <div className="border-b border-megalit-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-megalit-900">Performa lokasi</h3>
        <p className="mt-0.5 text-xs text-megalit-600">
          Ringkasan transaksi dan pendapatan untuk periode yang dipilih.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-megalit-200 bg-megalit-50 text-xs font-medium uppercase text-megalit-600">
              <th className="px-4 py-2">Lokasi</th>
              <th className="px-4 py-2 text-right">Transaksi</th>
              <th className="px-4 py-2 text-right">Pendapatan</th>
              <th className="px-4 py-2">Petugas bertugas</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-megalit-600">
                  Belum ada data lokasi.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.locationName} className="border-b border-megalit-100 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-megalit-900">
                    {r.locationName}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-megalit-800">
                    {r.transactionsToday}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-megalit-900">
                    {formatRp(r.revenueTodayRp)}
                  </td>
                  <td className="px-4 py-2.5 text-megalit-700">{r.officersOnDuty}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
