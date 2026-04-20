import Link from "next/link";
import { Bike, Car } from "lucide-react";
import { formatRp } from "@/lib/format/rp";
import type { TransactionListItem } from "@/lib/transactions/types";
import { TransactionStatusBadge } from "./transaction-status-badge";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

/** Design spec 05 — chip jenis kendaraan (secondary vs primary highlight). */
function VehicleCell({ vehicleType }: { vehicleType: TransactionListItem["vehicleType"] }) {
  const isMotor = vehicleType === "Motor";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        isMotor
          ? "bg-teluk-100 text-teluk-700"
          : "bg-bomba-100 text-bomba-700"
      }`}
    >
      {isMotor ? (
        <Bike className="size-3.5" strokeWidth={2} aria-hidden />
      ) : (
        <Car className="size-3.5" strokeWidth={2} aria-hidden />
      )}
      {vehicleType}
    </span>
  );
}

export function TransactionTable({ rows }: { rows: TransactionListItem[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-(--color-border) bg-[var(--color-surface-2)] px-6 py-16 text-center">
        <p className="text-sm font-medium text-(--color-text)">Belum ada transaksi</p>
        <p className="mt-1 max-w-sm text-sm text-(--color-text-muted)">
          Ubah rentang tanggal atau filter untuk melihat data lain, atau coba lagi
          nanti.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-(--color-border) bg-(--color-surface-card)">
      <table className="w-full min-w-[880px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-(--color-border) bg-[var(--color-surface-offset)]">
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
              Kode transaksi
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
              Waktu
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
              Lokasi
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
              Petugas
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
              Kendaraan
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-(--color-text-muted)">
              Nominal
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[var(--color-divider)] transition-colors last:border-b-0 hover:cursor-pointer hover:bg-(--color-surface-offset)"
            >
              <td className="px-4 py-3 align-middle">
                <Link
                  href={`/transaksi/${row.id}`}
                  className="font-mono text-sm font-medium text-teluk-600 underline-offset-2 hover:text-teluk-700 hover:underline"
                >
                  {row.code}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3 align-middle text-(--color-text-muted)">
                {formatDateTime(row.time)}
              </td>
              <td className="px-4 py-3 align-middle text-(--color-text)">{row.locationName}</td>
              <td className="px-4 py-3 align-middle text-(--color-text-muted)">
                {row.officerName}
              </td>
              <td className="px-4 py-3 align-middle">
                <VehicleCell vehicleType={row.vehicleType} />
              </td>
              <td className="px-4 py-3 text-right align-middle text-sm font-medium tabular-nums text-(--color-text)">
                {formatRp(row.amountRp)}
              </td>
              <td className="px-4 py-3 align-middle">
                <TransactionStatusBadge status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
