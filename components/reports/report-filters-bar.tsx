import type { FilterOption } from "@/lib/transactions/types";
import type { ReportFilters } from "@/lib/reports/types";

const inputClass =
  "h-10 rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 text-sm text-(--color-text) transition-[border-color,box-shadow] focus:border-bomba-500 focus:outline-none focus:ring-2 focus:ring-bomba-100";

type Props = {
  filters: ReportFilters;
  locations: FilterOption[];
};

export function ReportFiltersBar({ filters, locations }: Props) {
  return (
    <form
      action="/laporan"
      method="get"
      className="-mx-6 mb-6 border-b border-(--color-border) px-6 py-4"
    >
      <div className="flex flex-col gap-4 rounded-lg border border-(--color-border) bg-(--color-surface-card) p-5 shadow-sm">
        <p className="text-xs font-medium tracking-wide text-(--color-text-muted)">
          Filter laporan
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
            Kendaraan
            <select
              name="kendaraan"
              defaultValue={filters.vehicle}
              className={inputClass}
            >
              <option value="Semua">Semua</option>
              <option value="Motor">Motor</option>
              <option value="Mobil">Mobil</option>
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="h-10 w-full rounded-md bg-bomba-500 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-bomba-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bomba-500"
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
