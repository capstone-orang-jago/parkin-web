"use client";

import { useState } from "react";
import { OfficerTable } from "@/components/officers/officer-table";
import {
	OfficerFormModal,
} from "@/components/officers/officer-form-modal";
import type { OfficerListItem } from "@/lib/officers/types";
import {
	createOfficer,
	deleteOfficer,
	type OfficerFormValues,
} from "@/lib/officers/post-officers";

type Props = {
	rows: OfficerListItem[];
};

const emptyForm: OfficerFormValues = {
	name: "",
	email: "",
	password: "",
	telephone: "",
};

export function OfficerSectionClient({ rows }: Props) {
	const [open, setOpen] = useState(false);
	const [formValues, setFormValues] = useState<OfficerFormValues>(emptyForm);

	function openCreate() {
		setFormValues(emptyForm);
		setOpen(true);
	}

	async function handleDelete(row: OfficerListItem) {
		const ok = window.confirm(`Hapus petugas ${row.fullName}?`);
		if (!ok) return;

		await deleteOfficer(row.id);
		window.location.reload();
	}

	async function submit(values: OfficerFormValues) {
		await createOfficer(values);
		window.location.reload();
	}

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h2 className="text-lg font-bold text-(--color-text)">Petugas</h2>
					<p className="mt-1 text-sm text-(--color-text-muted)">
						Kelola akun petugas lapangan dan penugasan lokasi.
					</p>
				</div>
				<button
					type="button"
					onClick={openCreate}
					className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-bomba-500 px-4 text-sm font-medium text-white shadow-sm"
				>
					Tambah Petugas
				</button>
			</header>

			<OfficerTable rows={rows} onDelete={handleDelete} />

			<OfficerFormModal
				open={open}
				initialValues={formValues}
				onClose={() => setOpen(false)}
				onSubmit={submit}
			/>
		</div>
	);
}
