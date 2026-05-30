import { useState } from "react";
import type { OfficerSelectOption } from "@/lib/officers/post-officers";

export type LocationFormValues = {
  nama_lokasi: string;
  alamat: string;
  petugas_id: string;
  is_active: boolean;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: LocationFormValues;
  officers: OfficerSelectOption[];
  onClose: () => void;
  onSubmit: (values: LocationFormValues) => Promise<void>;
};

function FormContent({ mode, initialValues, officers, onClose, onSubmit }: Omit<Props, "open">) {
  const [values, setValues] = useState<LocationFormValues>(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="w-full max-w-lg rounded-xl bg-(--color-surface-card) p-6 shadow-xl">
      <h3 className="text-lg font-bold text-(--color-text)">{mode === "create" ? "Tambah Lokasi" : "Edit Lokasi"}</h3>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <div>
          <label className="block text-sm font-medium text-(--color-text)">Nama lokasi</label>
          <input
            required
            className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-(--color-text)"
            value={values.nama_lokasi}
            onChange={(e) => setValues({ ...values, nama_lokasi: e.target.value })}
            placeholder="Contoh: Parkir Palu Grand Mall"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-(--color-text)">Alamat</label>
          <input
            required
            className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-(--color-text)"
            value={values.alamat}
            onChange={(e) => setValues({ ...values, alamat: e.target.value })}
            placeholder="Contoh: Jl. Empu Nala No. 1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-(--color-text)">Petugas</label>
          <select
            required
            className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-(--color-text)"
            value={values.petugas_id}
            onChange={(e) => setValues({ ...values, petugas_id: e.target.value })}
          >
            <option value="" disabled>
              Pilih petugas…
            </option>
            {officers.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.telephone}) {o.assignedLocation ? ` — ${o.assignedLocation}` : ""}
              </option>
            ))}
          </select>
          {officers.length === 0 && <p className="mt-1 text-xs text-(--color-text-muted)">Belum ada petugas tersedia.</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-(--color-text)">Status Lokasi</label>
          <button
            type="button"
            role="switch"
            aria-checked={values.is_active}
            onClick={() => setValues({ ...values, is_active: !values.is_active })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${values.is_active ? "bg-bomba-500" : "bg-(--color-surface-offset)"}`}
          >
            <span
              className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${values.is_active ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
          <span className="ml-2 text-xs text-(--color-text-muted)">{values.is_active ? "Aktif" : "Nonaktif"}</span>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-md border border-(--color-border) px-4 py-2 text-sm text-(--color-text) hover:bg-(--color-surface-offset)">
            Batal
          </button>
          <button type="submit" disabled={loading || officers.length === 0} className="rounded-md bg-bomba-500 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-60">
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function LocationFormModal({ open, mode, initialValues, officers, onClose, onSubmit }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <FormContent key={`${mode}-${initialValues.nama_lokasi}`} mode={mode} initialValues={initialValues} officers={officers} onClose={onClose} onSubmit={onSubmit} />
    </div>
  );
}
