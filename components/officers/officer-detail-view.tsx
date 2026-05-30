import Link from "next/link";
import { Bike, Car, Clock, Hash, Mail, MapPin, Phone, User } from "lucide-react";
import { TransactionStatusBadge } from "@/components/transactions/transaction-status-badge";
import { formatRp } from "@/lib/format/rp";
import type { OfficerDetail, OfficerRecentTransaction } from "@/lib/officers/types";

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  if (p.length >= 2) return (p[0]![0] + p[1]![0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function VehicleCell({ vehicleType }: { vehicleType: OfficerRecentTransaction["vehicleType"] }) {
  const isMotor = vehicleType === "Motor";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-surface-2) px-2.5 py-1 text-xs font-medium ${
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

export function OfficerDetailView({ officer }: { officer: OfficerDetail }) {
  const transaksiFilterHref = `/transaksi?petugas=${encodeURIComponent(officer.id)}`;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold tracking-tight text-(--color-text)">Detail Petugas</h1>

      {/* Profil */}
      <div className="overflow-hidden rounded-xl border border-(--color-border) border-l-4 border-l-bomba-500 bg-(--color-surface-card) shadow-sm">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-6">
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-bomba-100 text-lg font-semibold text-bomba-800"
            aria-hidden
          >
            {initials(officer.fullName)}
          </span>
          <div className="min-w-0 flex-1 space-y-3">
            <h2 className="text-xl font-bold text-(--color-text)">{officer.fullName}</h2>
            <p className="flex items-center gap-2 text-sm text-(--color-text-muted)">
              <Mail className="size-4 shrink-0 text-bomba-500" strokeWidth={1.75} aria-hidden />
              <span>{officer.email}</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-(--color-text-muted)">
              <Phone className="size-4 shrink-0 text-bomba-500" strokeWidth={1.75} aria-hidden />
              <span className="font-mono">{officer.phone}</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-(--color-text-muted)">
              <Hash className="size-4 shrink-0 text-(--color-text-faint)" strokeWidth={1.75} aria-hidden />
              <span>
                ID petugas:{" "}
                <span className="font-mono font-medium text-(--color-text)">{officer.officerCode}</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Performa */}
        <div className="space-y-3 lg:col-span-3">
          <h3 className="text-sm font-semibold text-(--color-text)">Performa</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-(--color-border) bg-(--color-surface-card) p-4 shadow-sm">
              <p className="text-xs font-medium text-(--color-text-muted)">Hari bertugas</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-(--color-text)">
                {officer.totalDutyDays.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="rounded-xl border border-teluk-200 bg-teluk-50 p-4 shadow-sm ring-1 ring-teluk-100/80">
              <p className="text-xs font-medium text-teluk-900/80">Total transaksi ditangani</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-teluk-900">
                {officer.totalTransactions.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* Lokasi penugasan */}
        <div className="rounded-xl border border-(--color-border) bg-(--color-surface-card) p-5 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-(--color-text)">Lokasi penugasan saat ini</h3>
          {officer.assignedLocationName ? (
            <p className="mt-4 flex items-start gap-2 text-sm text-(--color-text)">
              <MapPin className="mt-0.5 size-4 shrink-0 text-bomba-500" strokeWidth={1.75} aria-hidden />
              <span>{officer.assignedLocationName}</span>
            </p>
          ) : (
            <p className="mt-4 text-sm text-(--color-text-muted)">Belum ditugaskan ke lokasi</p>
          )}
        </div>
      </div>

      {/* Transaksi terbaru */}
      <div className="overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-card) shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--color-border) px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-(--color-text-muted)" strokeWidth={1.75} aria-hidden />
            <h3 className="text-sm font-semibold text-(--color-text)">Transaksi terbaru</h3>
          </div>
          <Link
            href={transaksiFilterHref}
            className="text-sm font-medium text-teluk-600 hover:text-teluk-700 hover:underline"
          >
            Lihat semua
          </Link>
        </div>
        {officer.recentTransactions.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-(--color-text-muted) sm:px-5">
            Belum ada transaksi untuk petugas ini.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-280 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-(--color-border) bg-(--color-surface-offset)">
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Kode
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Waktu
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Pengguna
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) sm:px-5">
                    Lokasi
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
                {officer.recentTransactions.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-(--color-divider) last:border-b-0 hover:bg-(--color-surface-offset)/60"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-(--color-text-muted) sm:px-5">
                      {row.transactionCode}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-(--color-text-muted) sm:px-5">
                      {formatDateTime(row.time)}
                    </td>
                    <td className="px-4 py-3 text-(--color-text) sm:px-5">
                      {row.pengguna ? (
                        <span className="flex items-center gap-1.5">
                          <User className="size-3.5 text-(--color-text-muted)" strokeWidth={1.75} aria-hidden />
                          {row.pengguna.name}
                        </span>
                      ) : (
                        <span className="text-(--color-text-muted)">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-(--color-text) sm:px-5">{row.locationName}</td>
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
          href="/petugas"
          className="inline-flex h-9 items-center rounded-md border border-teluk-500 bg-(--color-surface-card) px-4 text-sm font-medium text-teluk-700 transition-colors hover:bg-teluk-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teluk-500"
        >
          Kembali ke daftar
        </Link>
      </div>
    </div>
  );
}
