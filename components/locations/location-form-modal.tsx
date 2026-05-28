import { useEffect, useState } from "react";

export type LocationFormValues = {
	alamat: string;
	is_active: boolean;
	nama_lokasi: string;
	petugas_id: string;
};

type Props = {
	open: boolean;
	mode: "create" | "edit";
	initialValues: LocationFormValues;
	onClose: () => void;
	onSubmit: (values: LocationFormValues) => Promise<void>;
};

export function LocationFormModal({
	open,
	mode,
	initialValues,
	onClose,
	onSubmit,
}: Props) {
	const [values, setValues] = useState<LocationFormValues>(initialValues);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			setValues(initialValues);
			setError(null);
		}
	}, [open, initialValues]);

	if (!open) return null;

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			await onSubmit(values);
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Gagal menyimpan lokasi.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
				<h3 className="text-lg font-bold">
					{mode === "create" ? "Tambah Lokasi" : "Edit Lokasi"}
				</h3>

				<form className="mt-4 space-y-4" onSubmit={handleSubmit}>
					{error ? (
						<p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
							{error}
						</p>
					) : null}

					<div>
						<label className="block text-sm font-medium">Nama lokasi</label>
						<input
							className="mt-1 w-full rounded-md border px-3 py-2"
							value={values.nama_lokasi}
							onChange={(e) =>
								setValues({ ...values, nama_lokasi: e.target.value })
							}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium">Alamat</label>
						<input
							className="mt-1 w-full rounded-md border px-3 py-2"
							value={values.alamat}
							onChange={(e) => setValues({ ...values, alamat: e.target.value })}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium">Petugas ID</label>
						<input
							className="mt-1 w-full rounded-md border px-3 py-2"
							value={values.petugas_id}
							onChange={(e) =>
								setValues({ ...values, petugas_id: e.target.value })
							}
						/>
					</div>

					<label className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							checked={values.is_active}
							onChange={(e) =>
								setValues({ ...values, is_active: e.target.checked })
							}
						/>
						Aktif
					</label>

					<div className="flex justify-end gap-2 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded-md border px-4 py-2"
						>
							Batal
						</button>
						<button
							type="submit"
							disabled={loading}
							className="rounded-md bg-blue-600 px-4 py-2 text-white"
						>
							{loading ? "Menyimpan..." : "Simpan"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
