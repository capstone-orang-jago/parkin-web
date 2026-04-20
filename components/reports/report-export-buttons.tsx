"use client";

import type { TransactionListItem } from "@/lib/transactions/types";

function csvEscape(cell: string) {
  if (/[",\n\r]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`;
  return cell;
}

function buildCsv(rows: TransactionListItem[]): string {
  const header = [
    "Kode transaksi",
    "Waktu",
    "Lokasi",
    "Kendaraan",
    "Nominal (Rp)",
    "Status",
  ];
  const lines = [header.join(",")];
  const fmtTime = (iso: string) =>
    new Intl.DateTimeFormat("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  for (const r of rows) {
    lines.push(
      [
        csvEscape(r.code),
        csvEscape(fmtTime(r.time)),
        csvEscape(r.locationName),
        csvEscape(r.vehicleType),
        String(r.amountRp),
        csvEscape(r.status),
      ].join(","),
    );
  }
  return "\uFEFF" + lines.join("\r\n");
}

export function ReportExportButtons({
  dateFrom,
  dateTo,
  rows,
}: {
  dateFrom: string;
  dateTo: string;
  rows: TransactionListItem[];
}) {
  const disabled = rows.length === 0;
  const filename = `parkin-laporan-${dateFrom}-${dateTo}.csv`;

  function downloadCsv() {
    const blob = new Blob([buildCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={downloadCsv}
        className="inline-flex h-9 items-center justify-center rounded-md bg-bomba-500 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-bomba-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bomba-500"
      >
        Ekspor CSV
      </button>
      <button
        type="button"
        disabled
        title="Menyusul integrasi API"
        className="inline-flex h-9 items-center justify-center rounded-md border border-teluk-500 bg-(--color-surface-card) px-4 text-sm font-medium text-teluk-700 opacity-60"
      >
        Ekspor Excel
      </button>
      {disabled ? (
        <span className="text-sm text-(--color-text-muted)">Tidak ada baris untuk diekspor.</span>
      ) : (
        <span className="text-sm text-(--color-text-muted)">
          {rows.length.toLocaleString("id-ID")} baris · {filename}
        </span>
      )}
    </div>
  );
}
