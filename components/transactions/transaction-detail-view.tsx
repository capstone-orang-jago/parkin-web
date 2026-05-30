import Link from "next/link";
import { Bike, Car } from "lucide-react";
import { formatRp } from "@/lib/format/rp";
import type { TransactionDetail } from "@/lib/transactions/types";
import { TransactionStatusBadge } from "./transaction-status-badge";

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date(iso));
}

export function TransactionDetailView({ tx }: { tx: TransactionDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold text-(--color-text)">Detail transaksi</h2>
          <TransactionStatusBadge status={tx.status} />
        </div>
        <p className="font-mono text-sm text-(--color-text-muted)">{tx.code}</p>
      </div>

      <div className="rounded-lg border border-(--color-border) bg-(--color-surface-card) p-6 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
              Parkir &amp; tarif
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-(--color-divider) pb-2">
                <dt className="text-(--color-text-muted)">Waktu</dt>
                <dd className="text-right font-medium text-(--color-text)">
                  {formatDateTime(tx.time)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-(--color-divider) pb-2">
                <dt className="text-(--color-text-muted)">Lokasi</dt>
                <dd className="text-right font-medium text-(--color-text)">
                  {tx.locationName}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-(--color-divider) pb-2">
                <dt className="text-(--color-text-muted)">Petugas</dt>
                <dd className="text-right font-medium text-(--color-text)">
                  {tx.officerName}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-(--color-divider) pb-2">
                <dt className="text-(--color-text-muted)">Kendaraan</dt>
                <dd className="flex items-center justify-end gap-2 font-medium text-(--color-text)">
                  {tx.vehicleType === "Motor" ? (
                    <Bike className="size-4 text-teluk-500" strokeWidth={1.75} aria-hidden />
                  ) : (
                    <Car className="size-4 text-bomba-500" strokeWidth={1.75} aria-hidden />
                  )}
                  {tx.vehicleType}
                </dd>
              </div>
              <div className="flex justify-between gap-4 pb-2">
                <dt className="text-(--color-text-muted)">Tarif</dt>
                <dd className="text-right font-medium tabular-nums text-(--color-text)">
                  {formatRp(tx.tariffRp)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
              Pengguna &amp; saldo
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-(--color-divider) pb-2">
                <dt className="text-(--color-text-muted)">Nama pengguna</dt>
                <dd className="text-right font-medium text-(--color-text)">{tx.userName}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-(--color-divider) pb-2">
                <dt className="text-(--color-text-muted)">Email</dt>
                <dd className="text-right text-(--color-text)">{tx.userEmail}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-(--color-divider) pb-2">
                <dt className="text-(--color-text-muted)">ID pengguna</dt>
                <dd className="font-mono text-right text-(--color-text-muted)">{tx.userIdMasked}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-(--color-divider) pb-2">
                <dt className="text-(--color-text-muted)">Saldo sebelum</dt>
                <dd className="text-right text-lg font-semibold tabular-nums text-(--color-text)">
                  {formatRp(tx.balanceBeforeRp)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 pb-2">
                <dt className="text-(--color-text-muted)">Saldo sesudah</dt>
                <dd className="text-right text-lg font-semibold tabular-nums text-teluk-600">
                  {formatRp(tx.balanceAfterRp)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div>
        <Link
          href="/transaksi"
          className="inline-flex h-9 items-center rounded-md border border-teluk-500 bg-(--color-surface-card) px-4 text-sm font-medium text-teluk-700 transition-colors hover:bg-teluk-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teluk-500"
        >
          Kembali ke daftar
        </Link>
      </div>
    </div>
  );
}
