/** Page header skeleton with optional action button. */
export function PageHeaderSkeleton({
  titleWidth = "w-48",
  subtitleWidth = "w-72",
  actionWidth,
}: {
  titleWidth?: string;
  subtitleWidth?: string;
  actionWidth?: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
      <div>
        <div className={`h-7 ${titleWidth} rounded bg-megalit-200`} />
        <div className={`mt-2 h-4 ${subtitleWidth} max-w-full rounded bg-megalit-100`} />
      </div>
      {actionWidth && <div className={`h-9 ${actionWidth} rounded-md bg-megalit-200`} />}
    </div>
  );
}

/** Table skeleton with configurable row count. */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="h-96 rounded-lg border border-megalit-200 bg-(--color-surface-card)">
      <div className="h-12 border-b border-megalit-200 bg-megalit-50" />
      <div className="space-y-2 p-4">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="h-10 rounded bg-megalit-100" />
        ))}
      </div>
    </div>
  );
}
