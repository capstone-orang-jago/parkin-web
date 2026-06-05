/** Shared Recharts tooltip contentStyle for consistent chart tooltips. */
export const CHART_TOOLTIP_STYLE = {
  background: "#fff",
  border: "1px solid #e1d9ce",
  borderRadius: "8px",
  fontSize: "13px",
} as const;

/** Shared tick style for chart axes. */
export const CHART_TICK_STYLE = { fontSize: 11, fill: "#71624f" } as const;

/** Empty-state container for charts. */
export function ChartEmptyState({ message }: { message?: string }) {
  return (
    <div className="flex h-70 items-center justify-center rounded-lg border border-dashed border-megalit-300 bg-megalit-100/50 text-sm text-megalit-600">
      {message ?? "Belum ada data untuk periode ini."}
    </div>
  );
}
