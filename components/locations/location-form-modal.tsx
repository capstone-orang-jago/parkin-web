"use client";

import { useState } from "react";
import type { OfficerSelectOption } from "@/lib/officers/post-officers";
import { FormModal, FormShell } from "@/components/shared/form-modal";
import { FormTextField, FormSelectField, ToggleSwitch } from "@/components/shared/form-text-field";

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
    <FormShell
      title={mode === "create" ? "Tambah Lokasi" : "Edit Lokasi"}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      submitDisabled={officers.length === 0}
    >
      <FormTextField
        label="Nama lokasi"
        required
        value={values.nama_lokasi}
        onChange={(v) => setValues({ ...values, nama_lokasi: v })}
        placeholder="Contoh: Parkir Palu Grand Mall"
      />

      <FormTextField
        label="Alamat"
        required
        value={values.alamat}
        onChange={(v) => setValues({ ...values, alamat: v })}
        placeholder="Contoh: Jl. Empu Nala No. 1"
      />

      <FormSelectField
        label="Petugas"
        required
        value={values.petugas_id}
        onChange={(v) => setValues({ ...values, petugas_id: v })}
        placeholder="Pilih petugas…"
      >
        {officers.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name} ({o.telephone}) {o.assignedLocation ? ` — ${o.assignedLocation}` : ""}
          </option>
        ))}
      </FormSelectField>
      {officers.length === 0 && <p className="mt-1 text-xs text-(--color-text-muted)">Belum ada petugas tersedia.</p>}

      <ToggleSwitch
        label="Status Lokasi"
        checked={values.is_active}
        onChange={(v) => setValues({ ...values, is_active: v })}
      />
    </FormShell>
  );
}

export function LocationFormModal({ open, mode, initialValues, officers, onClose, onSubmit }: Props) {
  return (
    <FormModal open={open} onClose={onClose}>
      <FormContent key={`${mode}-${initialValues.nama_lokasi}`} mode={mode} initialValues={initialValues} officers={officers} onClose={onClose} onSubmit={onSubmit} />
    </FormModal>
  );
}
