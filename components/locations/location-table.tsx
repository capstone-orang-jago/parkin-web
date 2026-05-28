import Link from "next/link";
import { LocationStatusBadge } from "@/components/locations/location-status-badge";
import type { LocationListItem } from "@/lib/locations/types";
import { Eye, Pencil, Trash } from "lucide-react";

const stubTitle = "Menyusul integrasi API";

type Props = {
	rows: LocationListItem[];
	onEdit: (row: LocationListItem) => void;
	onDelete: (row: LocationListItem) => void;
};

export function LocationTable({ rows, onEdit, onDelete }: Props) {
	if (rows.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-(--color-border) bg-(--color-surface-2) px-6 py-16 text-center">
				<p className="text-sm font-medium text-(--color-text)">
					Belum ada lokasi
				</p>
				<p className="mt-1 max-w-sm text-sm text-(--color-text-muted)">
					Data lokasi akan tampil di sini setelah ditambahkan.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto rounded-lg border border-(--color-border) bg-(--color-surface-card)">
			<table className="w-full min-w-[960px] border-collapse text-left text-sm">
				<thead>
					<tr className="border-b border-(--color-border) bg-(--color-surface-offset)">
						<th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
							Nama lokasi
						</th>
						<th className="min-w-[200px] px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
							Alamat
						</th>
						<th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
							Petugas aktif
						</th>
						<th className="whitespace-nowrap px-4 py-3 text-sm text-center font-semibold text-(--color-text-muted)">
							Status
						</th>
						<th className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-(--color-text-muted)">
							Transaksi hari ini
						</th>
						<th className="whitespace-nowrap px-4 py-3 text-sm text-right font-semibold text-(--color-text-muted)">
							Aksi <span className="sr-only">Lokasi</span>
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
									href={`/lokasi/${row.id}`}
									className="font-medium text-teluk-600 underline-offset-2 hover:text-teluk-700 hover:underline"
								>
									{row.name}
								</Link>
							</td>
							<td className="max-w-xs px-4 py-3 align-middle text-(--color-text-muted)">
								{row.address}
							</td>
							<td className="px-4 py-3 align-middle text-(--color-text-muted)">
								{row.activeOfficerLabel}
							</td>
							<td className="px-4 py-3 align-middle">
								<LocationStatusBadge status={row.status} />
							</td>
							<td className="px-4 py-3 text-right align-middle tabular-nums text-(--color-text)">
								{row.transactionsToday}
							</td>
							<td className="whitespace-nowrap px-4 py-3 align-right">
								<div className="flex flex-wrap items-center justify-end gap-2">
									<Link
										href={`/lokasi/${row.id}`}
										className="text-sm font-medium text-teluk-600 hover:text-teluk-700 hover:underline"
									>
										<Eye className="size-4" />
									</Link>
									<button
										type="button"
										onClick={() => onEdit(row)}
										className="text-sm font-medium text-(--color-text-muted)"
									>
										<Pencil className="size-4" />
									</button>
									<button
										type="button"
										onClick={() => onDelete(row)}
										aria-label={`Hapus lokasi ${row.name}`}
										className="text-sm font-medium text-(--color-text-muted)"
									>
										<Trash className="size-4" />
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
