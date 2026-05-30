"use client";

import { useState } from "react";
import { LocationTable } from "@/components/locations/location-table";
import {
	LocationFormModal,
	type LocationFormValues,
} from "@/components/locations/location-form-modal";
import type { LocationListItem } from "@/lib/locations/types";
import {
	createLocation,
	updateLocation,
	deleteLocation,
} from "@/lib/locations/post-update-locations";
import {
	getOfficersForSelect,
	type OfficerSelectOption,
} from "@/lib/officers/post-officers";

type Props = {
	rows: LocationListItem[];
};

const emptyForm: LocationFormValues = {
	alamat: "",
	nama_lokasi: "",
	petugas_id: "",
	is_active: true,
};

export function LocationSectionClient({ rows }: Props) {
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<"create" | "edit">("create");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [formValues, setFormValues] = useState<LocationFormValues>(emptyForm);
	const [officers, setOfficers] = useState<OfficerSelectOption[]>([]);

	async function openCreate() {
		setMode("create");
		setSelectedId(null);
		setFormValues(emptyForm);
		const list = await getOfficersForSelect();
		setOfficers(list);
		setOpen(true);
	}

	async function openEdit(row: LocationListItem) {
		setMode("edit");
		setSelectedId(row.id);
		setFormValues({
			alamat: row.address,
			nama_lokasi: row.name,
			petugas_id: "",
			is_active: row.status === "active",
		});
		const list = await getOfficersForSelect();
		setOfficers(list);
		setOpen(true);
	}

	async function handleDelete(row: LocationListItem) {
		const ok = window.confirm(`Hapus lokasi ${row.name}?`);
		if (!ok) return;

		await deleteLocation(row.id);
		window.location.reload();
	}

	async function submit(values: LocationFormValues) {
		if (mode === "create") {
			await createLocation(values);
		} else {
			if (!selectedId) throw new Error("ID lokasi tidak ditemukan.");
			await updateLocation(selectedId, values);
		}
		window.location.reload();
	}

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h2 className="text-lg font-bold text-(--color-text)">Lokasi Parkir</h2>
					<p className="mt-1 text-sm text-(--color-text-muted)">
						Kelola titik parkir resmi dan penugasan petugas.
					</p>
				</div>
				<button
					type="button"
					onClick={openCreate}
					className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-bomba-500 px-4 text-sm font-medium text-white shadow-sm"
				>
					Tambah Lokasi
				</button>
			</header>

			<LocationTable rows={rows} onEdit={openEdit} onDelete={handleDelete} />

			<LocationFormModal
				open={open}
				mode={mode}
				initialValues={formValues}
				officers={officers}
				onClose={() => setOpen(false)}
				onSubmit={submit}
			/>
		</div>
	);
}
