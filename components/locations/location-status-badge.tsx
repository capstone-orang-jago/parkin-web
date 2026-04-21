import type { LocationOperationalStatus } from "@/lib/locations/types";

const styles: Record<LocationOperationalStatus, string> = {
  active:
    "bg-[var(--color-success-highlight)] text-[var(--color-success)] ring-1 ring-[var(--color-success)]/15",
  inactive:
    "bg-(--color-surface-offset) text-(--color-text-muted) ring-1 ring-[var(--color-border)]",
};

const labels: Record<LocationOperationalStatus, string> = {
  active: "Aktif",
  inactive: "Nonaktif",
};

export function LocationStatusBadge({
  status,
}: {
  status: LocationOperationalStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
