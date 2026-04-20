export default function LokasiDetailLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-64 rounded bg-megalit-200" />
      <div className="h-40 rounded-lg border border-megalit-200 bg-megalit-50" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-lg border border-megalit-200 bg-(--color-surface-card)" />
        ))}
      </div>
      <div className="h-32 rounded-lg border border-megalit-200 bg-megalit-50" />
      <div className="h-64 rounded-lg border border-megalit-200 bg-(--color-surface-card)" />
    </div>
  );
}
