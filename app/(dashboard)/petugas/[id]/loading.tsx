export default function PetugasDetailLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-56 rounded bg-megalit-200" />
      <div className="h-36 rounded-lg border border-megalit-200 bg-megalit-50" />
      <div className="h-24 rounded-lg border border-megalit-200 bg-(--color-surface-card)" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 rounded-lg border border-megalit-200 bg-(--color-surface-card)" />
        ))}
      </div>
      <div className="h-40 rounded-lg border border-megalit-200 bg-megalit-50" />
      <div className="h-64 rounded-lg border border-megalit-200 bg-(--color-surface-card)" />
    </div>
  );
}
