"use client";

import { useState, type ReactNode } from "react";

/** Overlay wrapper for modals. Returns null when closed. */
export function FormModal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/** Standard form card shell with title, error banner, and submit/cancel buttons. */
export function FormShell({
  title,
  onClose,
  onSubmit,
  loading,
  error,
  submitLabel = "Simpan",
  submitDisabled,
  children,
}: {
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  submitLabel?: string;
  submitDisabled?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-lg rounded-xl bg-(--color-surface-card) p-6 shadow-xl">
      <h3 className="text-lg font-bold text-(--color-text)">{title}</h3>

      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        {children}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-(--color-border) px-4 py-2 text-sm text-(--color-text) hover:bg-(--color-surface-offset)"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading || submitDisabled}
            className="rounded-md bg-bomba-500 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Reusable form state hook — manages values, loading, error, and submit logic.
 * Eliminates the identical useState + handleSubmit pattern across all form modals.
 */
export function useFormSubmit<T>(
  initialValues: T,
  submitFn: (values: T) => Promise<void>,
  fallbackErrorMessage = "Gagal menyimpan.",
) {
  const [values, setValues] = useState<T>(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await submitFn(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : fallbackErrorMessage);
      throw err; // re-throw so callers can handle (e.g. don't close modal)
    } finally {
      setLoading(false);
    }
  }

  return { values, setValues, loading, error, handleSubmit };
}
