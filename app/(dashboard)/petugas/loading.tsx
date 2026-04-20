export default function PetugasLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <div className="h-7 w-40 rounded bg-megalit-200" />
          <div className="mt-2 h-4 w-80 max-w-full rounded bg-megalit-100" />
        </div>
        <div className="h-9 w-40 rounded-md bg-megalit-200" />
      </div>
      <div className="h-96 rounded-lg border border-megalit-200 bg-(--color-surface-card)">
        <div className="h-12 border-b border-megalit-200 bg-megalit-50" />
        <div className="space-y-2 p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded bg-megalit-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
