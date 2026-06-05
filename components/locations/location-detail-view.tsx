import Link from "next/link";
import { Bike, Car, Clock, MapPin } from "lucide-react";
import { LocationStatusBadge } from "@/components/locations/location-status-badge";
import { TransactionStatusBadge } from "@/components/transactions/transaction-status-badge";
import { formatRp } from "@/lib/format/rp";
import { formatDateTime } from "@/lib/date";
import type { LocationDetail } from "@/lib/locations/types";

export function LocationDetailView({ location }: { location: LocationDetail }) {
  const transaksiFilterHref = `/transaksi?lokasi=${encodeURIComponent(location.id)}`;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold tracking-tight text-(--color-text)">Detail Lokasi Parkir</h1>

      {/* Kartu identitas */}
      <div className="overflow-hidden rounded-xl border border-(--color-border) border-l-4 border-l-bomba-500 bg-(--color-surface-card) shadow-sm">
        <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-(--color-text)">{location.name}</h2>
              <LocationStatusBadge status={location.status} />
            </div>
            <p className="flex items-start gap-2 text-sm text-(--color-text-muted)">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-bomba-500"
                strokeWidth={1.75}
                aria-hidden
              />
              <span>{location.address}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Performa lokasi */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-(--color-text)">Performa lokasi</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-(--color-border) bg-(--color-surface-card) p-4 shadow-sm">
            <p className="text-xs font-medium text-(--color-text-muted)">Total transaksi</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-(--color-text)">
              {location.totalTransactions.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="rounded-xl border border-teluk-200 bg-teluk-50 p-4 shadow-sm ring-1 ring-teluk-100/80">
            <p className="text-xs font-medium text-teluk-900/80">Total pendapatan</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-teluk-900">
              {formatRp(location.totalRevenueRp)}
            </p>
          </div>
        </div>
      </div>

      {/* Transaksi terbaru */}
      <div className="overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-card) shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--color-border) px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-(--color-text-muted)" strokeWidth={1.75} aria-hidden />
            <h3 className="text-sm font-semibold text-(--color-text)">Transaksi terbaru di lokasi ini</h3>
          </div>
          <Link
            href={transaksiFilterHref}
            className="text-sm font-medium text-teluk-600 hover:text-teluk-700 hover:underline"
          >
            Lihat semua
          </Link>
        </div>
        {location.recentTransactions.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-(--color-text-muted) sm:px-5">
            Belum ada transaksi di lokasi ini.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-200 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-(--color-border) bg-(--color-surface-offset)">
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Kode
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Waktu
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Pengguna
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Petugas
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Kendaraan
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Nominal
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {location.recentTransactions.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-(--color-divider) last:border-b-0 hover:bg-(--color-surface-offset)/60"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-(--color-text-muted) sm:px-5">
                      {row.kodeTransaksi}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-(--color-text-muted) sm:px-5">
                      {formatDateTime(row.time)}
                    </td>
                    <td className="px-4 py-3 text-(--color-text) sm:px-5">{row.userName}</td>
                    <td className="px-4 py-3 text-(--color-text) sm:px-5">{row.officerName}</td>
                    <td className="px-4 py-3 sm:px-5">
                      <VehicleCell vehicleType={row.vehicleType} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-(--color-text) sm:px-5">
                      {formatRp(row.amountRp)}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <TransactionStatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <Link
          href="/lokasi"
          className="inline-flex h-9 items-center rounded-md border border-teluk-500 bg-(--color-surface-card) px-4 text-sm font-medium text-teluk-700 transition-colors hover:bg-teluk-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teluk-500"
        >
          Kembali ke daftar
        </Link>
      </div>
    </div>
  );
}
