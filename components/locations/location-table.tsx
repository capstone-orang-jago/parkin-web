import Link from "next/link";
import { LocationStatusBadge } from "@/components/locations/location-status-badge";
import type { LocationListItem } from "@/lib/locations/types";
import { Eye, Pencil, Trash } from "lucide-react";

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
			<table className="w-full min-w-180 border-collapse text-left text-sm">
				<thead>
					<tr className="border-b border-(--color-border) bg-(--color-surface-offset)">
						<th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
							Nama lokasi
						</th>
						<th className="min-w-50 px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
							Alamat
						</th>
						<th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
							Petugas aktif
						</th>
						<th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-(--color-text-muted)">
							Status
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
							<td className="whitespace-nowrap px-4 py-3 align-middle">
								<div className="flex flex-wrap items-center gap-2">
									<Link
										href={`/lokasi/${row.id}`}
										className="inline-flex text-teluk-600 hover:text-teluk-700"
										title="Detail"
										aria-label="Detail"
									>
										<Eye className="size-4" strokeWidth={1.75} />
									</Link>
									<button
										type="button"
										onClick={() => onEdit(row)}
										title="Edit"
										aria-label="Edit"
										className="text-(--color-text-muted) hover:text-teluk-600"
									>
										<Pencil className="size-4" strokeWidth={1.75} />
									</button>
									<button
										type="button"
										onClick={() => onDelete(row)}
										aria-label={`Hapus lokasi ${row.name}`}
										title="Hapus"
										className="text-(--color-text-muted) hover:text-red-600"
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
