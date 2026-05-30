export default function LaporanLoading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div>
        <div className="h-7 w-32 rounded bg-megalit-200" />
        <div className="mt-2 h-4 w-96 max-w-full rounded bg-megalit-100" />
      </div>
      <div className="h-40 rounded-lg border border-megalit-200 bg-megalit-50" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 rounded-lg border border-megalit-200 bg-(--color-surface-card)" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[280px] rounded-lg bg-megalit-100" />
        <div className="h-[280px] rounded-lg bg-megalit-100" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-5 w-48 rounded bg-megalit-200" />
        <div className="h-64 rounded-lg border border-megalit-200 bg-(--color-surface-card)" />
      </div>
      <div className="flex flex-col gap-3 border-t border-megalit-200 pt-6">
        <div className="h-5 w-32 rounded bg-megalit-200" />
        <div className="h-12 w-64 rounded-md bg-megalit-200" />
      </div>
    </div>
  );
}
