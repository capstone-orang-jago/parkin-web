import type { OfficerAccountStatus } from "@/lib/officers/types";

const styles: Record<OfficerAccountStatus, string> = {
  active:
    "bg-[var(--color-success-highlight)] text-[var(--color-success)] ring-1 ring-[var(--color-success)]/15",
  inactive:
    "bg-[var(--color-surface-offset)] text-[var(--color-text-muted)] ring-1 ring-[var(--color-border)]",
};

const labels: Record<OfficerAccountStatus, string> = {
  active: "Aktif",
  inactive: "Nonaktif",
};

export function OfficerStatusBadge({ status }: { status: OfficerAccountStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
