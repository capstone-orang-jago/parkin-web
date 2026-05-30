import type { TransactionStatus } from "@/lib/dashboard/types";

/** Design spec 05 — badge status transaksi (token semantik, bukan palet generik). */
const styles: Record<TransactionStatus, string> = {
  Sukses:
    "bg-[var(--color-success-highlight)] text-[var(--color-success)] ring-1 ring-[var(--color-success)]/15",
  Gagal:
    "bg-[var(--color-error-highlight)] text-[var(--color-error)] ring-1 ring-[var(--color-error)]/15",
};

export function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium tracking-wide ${styles[status]}`}
    >
      {status}
    </span>
  );
}
