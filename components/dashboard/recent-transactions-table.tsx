import Link from "next/link";
import type { RecentTransactionRow } from "@/lib/dashboard/types";
import { formatRp } from "@/lib/format/rp";

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

function StatusBadge({ status }: { status: RecentTransactionRow["status"] }) {
  const map = {
    Sukses: "bg-emerald-100 text-emerald-900",
    Gagal: "bg-red-100 text-red-800",
    Pending: "bg-amber-100 text-amber-900",
  } as const;
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

export function RecentTransactionsTable({ rows }: { rows: RecentTransactionRow[] }) {
  return (
    <section className="rounded-lg border border-megalit-200 bg-(--color-surface-card) shadow-sm">
      <div className="flex items-center justify-between border-b border-megalit-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-megalit-900">Transaksi terbaru</h3>
        <Link
          href="/transaksi"
          className="text-sm font-medium text-bomba-600 hover:text-bomba-700"
        >
          Lihat semua
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-megalit-200 bg-megalit-50 text-xs font-medium uppercase text-megalit-600">
              <th className="px-4 py-2">Waktu</th>
              <th className="px-4 py-2">Lokasi</th>
              <th className="px-4 py-2">Kendaraan</th>
              <th className="px-4 py-2 text-right">Nominal</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-megalit-600">
                  Belum ada transaksi.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-megalit-100 last:border-0">
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-megalit-800">
                    {formatDateTime(r.time)}
                  </td>
                  <td className="px-4 py-2.5 text-megalit-900">{r.locationName}</td>
                  <td className="px-4 py-2.5 text-megalit-800">{r.vehicleType}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-megalit-900">
                    {formatRp(r.amountRp)}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
