import Link from "next/link";
import { Bike, Calendar, Car, Clock, MapPin } from "lucide-react";
import { LocationStatusBadge } from "@/components/locations/location-status-badge";
import { TransactionStatusBadge } from "@/components/transactions/transaction-status-badge";
import { formatRp } from "@/lib/format/rp";
import type { LocationDetail, LocationRecentTransaction } from "@/lib/locations/types";

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function formatDateShort(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  if (p.length >= 2) return (p[0]![0] + p[1]![0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function VehicleCell({ vehicleType }: { vehicleType: LocationRecentTransaction["vehicleType"] }) {
  const isMotor = vehicleType === "Motor";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-surface-2) px-2.5 py-1 text-xs font-medium text-(--color-text) ${
        isMotor ? "text-teluk-800" : "text-bomba-800"
      }`}
    >
      {isMotor ? (
        <Bike className="size-3.5 text-teluk-600" strokeWidth={1.75} aria-hidden />
      ) : (
        <Car className="size-3.5 text-bomba-600" strokeWidth={1.75} aria-hidden />
      )}
      {vehicleType}
    </span>
  );
}

export function LocationDetailView({ location }: { location: LocationDetail }) {
  const stubTitle = "Menyusul integrasi API";
  const transaksiFilterHref = `/transaksi?lokasi=${encodeURIComponent(location.id)}`;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold tracking-tight text-(--color-text)">Detail Lokasi Parkir</h1>

      {/* Kartu identitas — aksen kiri Bomba (selaras mockup Stitch) */}
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
            <p className="flex items-center gap-2 text-sm text-(--color-text-muted)">
              <Calendar className="size-4 shrink-0 text-(--color-text-faint)" strokeWidth={1.75} aria-hidden />
              <span>
                Dibuat: <span className="font-medium text-(--color-text)">{formatDateShort(location.createdAt)}</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Performa lokasi */}
        <div className="space-y-3 lg:col-span-3">
          <h3 className="text-sm font-semibold text-(--color-text)">Performa lokasi</h3>
          <div className="grid gap-3 sm:grid-cols-3">
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
            <div className="rounded-xl border border-(--color-border) bg-(--color-surface-card) p-4 shadow-sm">
              <p className="text-xs font-medium text-(--color-text-muted)">Rata-rata harian</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-(--color-text)">
                {formatRp(location.avgDailyRp)}
              </p>
            </div>
          </div>
        </div>

        {/* Petugas ditugaskan */}
        <div className="rounded-xl border border-(--color-border) bg-(--color-surface-card) p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-(--color-text)">Petugas ditugaskan</h3>
            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-bomba-100 px-2 py-0.5 text-xs font-semibold text-bomba-800">
              {location.assignedOfficerNames.length}
            </span>
          </div>
          {location.assignedOfficerNames.length === 0 ? (
            <p className="mt-4 text-sm text-(--color-text-muted)">Tidak ada petugas aktif.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {location.assignedOfficerNames.map((n) => (
                <li key={n} className="flex items-center gap-3">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bomba-100 text-sm font-semibold text-bomba-800"
                    aria-hidden
                  >
                    {initials(n)}
                  </span>
                  <span className="font-medium text-(--color-text)">{n}</span>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            disabled
            title={stubTitle}
            className="mt-5 text-sm font-medium text-teluk-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ubah penugasan
          </button>
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
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-(--color-border) bg-(--color-surface-offset)">
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Waktu
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Kendaraan
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Petugas
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
                    <td className="whitespace-nowrap px-4 py-3 text-(--color-text-muted) sm:px-5">
                      {formatDateTime(row.time)}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <VehicleCell vehicleType={row.vehicleType} />
                    </td>
                    <td className="px-4 py-3 text-(--color-text) sm:px-5">{row.officerName}</td>
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
