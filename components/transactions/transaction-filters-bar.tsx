import type {
	FilterOption,
	TransactionFilters,
} from "@/lib/transactions/types";

const inputClass =
	"h-10 rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 text-sm text-(--color-text) transition-[border-color,box-shadow] focus:border-bomba-500 focus:outline-none focus:ring-2 focus:ring-bomba-100";

type Props = {
	filters: TransactionFilters;
	locations: FilterOption[];
	officers: FilterOption[];
	statuses: TransactionFilters["status"][];
	vehicles: TransactionFilters["vehicle"][];
};

export function TransactionFiltersBar({
	filters,
	locations,
	officers,
	statuses,
	vehicles,
}: Props) {
	return (
		<form
			action="/transaksi"
			method="get"
			className="-mx-6 mb-6 border-b border-(--color-border) px-6 py-4"
		>
			<div className="flex flex-col gap-4 rounded-lg border border-(--color-border) bg-(--color-surface-card) p-5 shadow-sm">
				<p className="text-xs font-medium tracking-wide text-(--color-text-muted)">
					Filter
				</p>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
					<label className="flex flex-col gap-1 text-xs font-medium text-(--color-text-muted)">
						Dari
						<input
							type="date"
							name="dari"
							defaultValue={filters.dateFrom}
							className={inputClass}
						/>
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-(--color-text-muted)">
						Sampai
						<input
							type="date"
							name="sampai"
							defaultValue={filters.dateTo}
							className={inputClass}
						/>
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-(--color-text-muted)">
						Lokasi
						<select
							name="lokasi"
							defaultValue={filters.locationId ?? ""}
							className={inputClass}
						>
							<option value="">Semua lokasi</option>
							{locations.map((o) => (
								<option key={o.id} value={o.id}>
									{o.label}
								</option>
							))}
						</select>
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-(--color-text-muted)">
						Petugas
						<select
							name="petugas"
							defaultValue={filters.officerId ?? ""}
							className={inputClass}
						>
							<option value="">Semua petugas</option>
							{officers.map((o) => (
								<option key={o.id} value={o.id}>
									{o.label}
								</option>
							))}
						</select>
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-(--color-text-muted)">
						Kendaraan
						<select
							name="kendaraan"
							defaultValue={filters.vehicle}
							className={inputClass}
						>
							{vehicles.map((vehicle) => (
								<option key={vehicle} value={vehicle}>
									{vehicle}
								</option>
							))}
						</select>
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-(--color-text-muted)">
						Status
						<select
							name="status"
							defaultValue={filters.status}
							className={inputClass}
						>
							{statuses.map((status) => (
								<option key={status} value={status}>
									{status}
								</option>
							))}
						</select>
					</label>
				</div>
				<div className="flex justify-end">
					<input type="hidden" name="halaman" value="1" />
					<button
						type="submit"
						className="h-11 rounded-md bg-bomba-500 px-6 text-base font-semibold text-white transition-colors hover:bg-bomba-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bomba-500 disabled:opacity-40"
					>
						Terapkan filter
					</button>
				</div>
			</div>
		</form>
	);
}
