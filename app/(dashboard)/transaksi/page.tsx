"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TransactionFiltersBar } from "@/components/transactions/transaction-filters-bar";
import { TransactionPagination } from "@/components/transactions/transaction-pagination";
import { TransactionTable } from "@/components/transactions/transaction-table";
import {
	parseTransactionFilters,
	parseTransactionPage,
} from "@/lib/transactions/search-params";
import type {
	TransactionFilterOptions,
	TransactionListResult,
} from "@/lib/transactions/types";

const EMPTY_OPTIONS: TransactionFilterOptions = {
	locations: [],
	officers: [],
	statuses: ["Semua"],
	vehicles: ["Semua"],
};

const INITIAL_DATA: TransactionListResult = {
	items: [],
	total: 0,
	page: 1,
	pageSize: 20,
};

export default function TransaksiListPage() {
	const searchParams = useSearchParams();

	/* ── parse URL params ── */
	const sp: Record<string, string> = {};
	searchParams.forEach((value, key) => {
		sp[key] = value;
	});
	const filters = parseTransactionFilters(sp);
	const page = parseTransactionPage(sp);

	/* ── state ── */
	const [data, setData] = useState<TransactionListResult>(INITIAL_DATA);
	const [options, setOptions] =
		useState<TransactionFilterOptions>(EMPTY_OPTIONS);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [retryKey, setRetryKey] = useState(0);

	/* ── fetch (all setState calls are in async callbacks) ── */
	useEffect(() => {
		let cancelled = false;

		const params = new URLSearchParams();
		params.set("dari", filters.dateFrom);
		params.set("sampai", filters.dateTo);
		if (filters.locationId) params.set("lokasi", filters.locationId);
		if (filters.officerId) params.set("petugas", filters.officerId);
		if (filters.vehicle !== "Semua")
			params.set("kendaraan", filters.vehicle);
		if (filters.status !== "Semua")
			params.set("status", filters.status);
		params.set("halaman", String(page));

		Promise.all([
			fetch(`/api/transactions?${params.toString()}`).then((r) =>
				r.ok
					? r.json()
					: r.json().then((j) => Promise.reject(new Error(j.error || "Gagal memuat transaksi."))),
			),
			fetch("/api/transactions/filter-options").then((r) =>
				r.ok
					? r.json()
					: r.json().then((j) => Promise.reject(new Error(j.error || "Gagal memuat filter."))),
			),
		])
			.then(([listJson, filterJson]) => {
				if (!cancelled) {
					setData(listJson);
					setOptions(filterJson);
					setError(null);
				}
			})
			.catch((e) => {
				if (!cancelled) {
					setError(
						e instanceof Error ? e.message : "Terjadi kesalahan.",
					);
				}
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [
		filters.dateFrom,
		filters.dateTo,
		filters.locationId,
		filters.officerId,
		filters.vehicle,
		filters.status,
		page,
		retryKey,
	]);

	/* ── retry handler (event, bukan effect) ── */
	function handleRetry() {
		setLoading(true);
		setError(null);
		setRetryKey((k) => k + 1);
	}

	/* ── loading state ── */
	if (loading) {
		return (
			<div className="flex flex-col gap-4 animate-pulse">
				<div className="h-10 w-full rounded-lg bg-(--color-surface-raised)" />
				<div className="h-64 w-full rounded-lg bg-(--color-surface-raised)" />
				<div className="h-8 w-48 rounded bg-(--color-surface-raised)" />
			</div>
		);
	}

	/* ── error state ── */
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-20">
				<p className="text-sm text-red-600">{error}</p>
				<button
					type="button"
					onClick={handleRetry}
					className="rounded-lg bg-megalit-600 px-4 py-2 text-sm font-medium text-white hover:bg-megalit-700"
				>
					Coba lagi
				</button>
			</div>
		);
	}

	/* ── success ── */
	return (
		<div className="flex flex-col">
			<TransactionFiltersBar
				filters={filters}
				locations={options.locations}
				officers={options.officers}
				statuses={options.statuses}
				vehicles={options.vehicles}
			/>

			<TransactionTable rows={data.items} />

			<TransactionPagination
				filters={filters}
				page={page}
				total={data.total}
				pageSize={data.pageSize}
			/>
		</div>
	);
}
