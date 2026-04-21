import Link from "next/link";
import { Eye, Pencil, Trash } from "lucide-react";
import { OfficerStatusBadge } from "@/components/officers/officer-status-badge";
import type { OfficerListItem } from "@/lib/officers/types";

const stubTitle = "Menyusul integrasi API";

export function OfficerTable({ rows }: { rows: OfficerListItem[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-(--color-border) bg-(--color-surface-2) px-6 py-16 text-center">
        <p className="text-sm font-medium text-(--color-text)">Belum ada petugas</p>
        <p className="mt-1 max-w-sm text-sm text-(--color-text-muted)">
          Data petugas akan tampil di sini setelah ditambahkan.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-(--color-border) bg-(--color-surface-card)">
      <table className="w-full min-w-[920px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-(--color-border) bg-(--color-surface-offset)">
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
              Nama
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
              Nomor telepon
            </th>
            <th className="min-w-[180px] px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
              Lokasi penugasan
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
              Status akun
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-(--color-text-muted)">
              Transaksi hari ini
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-(--color-divider) transition-colors last:border-b-0 hover:bg-(--color-surface-offset)"
            >
              <td className="px-4 py-3 align-middle">
                <Link
                  href={`/petugas/${row.id}`}
                  className="font-medium text-teluk-600 underline-offset-2 hover:text-teluk-700 hover:underline"
                >
                  {row.fullName}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3 align-middle font-mono text-(--color-text-muted)">
                {row.phone}
              </td>
              <td className="px-4 py-3 align-middle text-(--color-text)">{row.assignedLocationName}</td>
              <td className="px-4 py-3 align-middle">
                <OfficerStatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3 text-right align-middle tabular-nums text-(--color-text)">
                {row.transactionsToday}
              </td>
              <td className="whitespace-nowrap px-4 py-3 align-middle">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/petugas/${row.id}`}
                    className="inline-flex text-teluk-600 hover:text-teluk-700"
                    title="Detail"
                    aria-label="Detail"
                  >
                    <Eye className="size-4" strokeWidth={1.75} />
                  </Link>
                  <button
                    type="button"
                    disabled
                    title={stubTitle}
                    aria-label="Edit"
                    className="text-(--color-text-muted)"
                  >
                    <Pencil className="size-4" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    disabled
                    title={stubTitle}
                    aria-label="Nonaktifkan"
                    className="text-(--color-text-muted)"
                  >
                    <Trash className="size-4" strokeWidth={1.75} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
