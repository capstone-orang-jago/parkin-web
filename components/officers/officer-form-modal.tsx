"use client";

import { useState } from "react";
import type { OfficerFormValues } from "@/lib/officers/post-officers";
import { FormModal, FormShell } from "@/components/shared/form-modal";
import { FormTextField } from "@/components/shared/form-text-field";

type Props = {
  open: boolean;
  initialValues: OfficerFormValues;
  onClose: () => void;
  onSubmit: (values: OfficerFormValues) => Promise<void>;
};

function FormContent({
  initialValues,
  onClose,
  onSubmit,
}: Omit<Props, "open">) {
  const [values, setValues] = useState<OfficerFormValues>(initialValues);
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
      setError(err instanceof Error ? err.message : "Gagal menyimpan petugas.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormShell
      title="Tambah Petugas"
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      <FormTextField
        label="Nama lengkap"
        required
        value={values.name}
        onChange={(v) => setValues({ ...values, name: v })}
        placeholder="Masukkan nama petugas"
      />

      <FormTextField
        label="Email"
        type="email"
        required
        value={values.email}
        onChange={(v) => setValues({ ...values, email: v })}
        placeholder="contoh@email.com"
      />

      <FormTextField
        label="Nomor telepon"
        type="tel"
        required
        value={values.telephone}
        onChange={(v) => setValues({ ...values, telephone: v })}
        placeholder="08xxxxxxxxxx"
      />

      <FormTextField
        label="Password"
        type="password"
        required
        minLength={6}
        value={values.password}
        onChange={(v) => setValues({ ...values, password: v })}
        placeholder="Minimal 6 karakter"
      />
    </FormShell>
  );
}

export function OfficerFormModal({
  open,
  initialValues,
  onClose,
  onSubmit,
}: Props) {
  return (
    <FormModal open={open} onClose={onClose}>
      <FormContent
        key={initialValues.name}
        initialValues={initialValues}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </FormModal>
  );
}
