import Link from "next/link";
import type { TransactionFilters } from "@/lib/transactions/types";
import { transactionQueryString } from "@/lib/transactions/serialize-filters";

type Props = {
  filters: TransactionFilters;
  page: number;
  total: number;
  pageSize: number;
};

export function TransactionPagination({
  filters,
  page,
  total,
  pageSize,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  const qs = (p: number) => transactionQueryString(filters, p);

  const btn =
    "h-9 rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 text-sm font-medium text-(--color-text) transition-colors hover:bg-(--color-surface-offset)";
  const btnDisabled = "h-9 rounded-md border border-(--color-divider) px-3 text-sm text-[var(--color-text-faint)] opacity-60";

  return (
    <div className="flex flex-col items-stretch justify-between gap-3 border-t border-(--color-border) pt-4 sm:flex-row sm:items-center">
      <p className="text-sm text-(--color-text-muted)">
        Menampilkan{" "}
        <span className="font-medium text-(--color-text)">
          {start}-{end}
        </span>{" "}
        dari <span className="font-medium text-(--color-text)">{total}</span>
      </p>
      <div className="flex gap-2">
        {prev != null ? (
          <Link href={`/transaksi?${qs(prev)}`} className={btn}>
            Sebelumnya
          </Link>
        ) : (
          <span className={btnDisabled}>Sebelumnya</span>
        )}
        {next != null ? (
          <Link href={`/transaksi?${qs(next)}`} className={btn}>
            Selanjutnya
          </Link>
        ) : (
          <span className={btnDisabled}>Selanjutnya</span>
        )}
      </div>
    </div>
  );
}
