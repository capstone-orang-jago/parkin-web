import type { Metadata } from "next";
import { TransactionFiltersBar } from "@/components/transactions/transaction-filters-bar";
import { TransactionPagination } from "@/components/transactions/transaction-pagination";
import { TransactionTable } from "@/components/transactions/transaction-table";
import {
	getTransactionFilterOptions,
	getTransactionList,
} from "@/lib/transactions/get-transactions";
import {
	parseTransactionFilters,
	parseTransactionPage,
} from "@/lib/transactions/search-params";

export const metadata: Metadata = {
	title: "Transaksi",
};

type PageProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TransaksiListPage({ searchParams }: PageProps) {
	const sp = await searchParams;
	const filters = parseTransactionFilters(sp);
	const page = parseTransactionPage(sp);
	const [{ items, total, pageSize }, options] = await Promise.all([
		getTransactionList(filters, page),
		getTransactionFilterOptions(),
	]);

	return (
		<div className="flex flex-col">
			{/* <header className="mb-2">
        <h2 className="text-lg font-bold text-(--color-text)">Transaksi</h2>
        <p className="text-sm text-(--color-text-muted)">
          Kelola dan pantau data transaksi parkir digital.
        </p>
      </header> */}

			<TransactionFiltersBar
				filters={filters}
				locations={options.locations}
				officers={options.officers}
				statuses={options.statuses}
				vehicles={options.vehicles}
			/>

			<TransactionTable rows={items} />

			<TransactionPagination
				filters={filters}
				page={page}
				total={total}
				pageSize={pageSize}
			/>
		</div>
	);
}
