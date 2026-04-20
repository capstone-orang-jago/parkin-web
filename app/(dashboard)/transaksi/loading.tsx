export default function TransaksiLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div>
        <div className="h-7 w-48 rounded bg-megalit-200" />
        <div className="mt-2 h-4 w-72 max-w-full rounded bg-megalit-100" />
      </div>
      <div className="h-40 rounded-lg bg-megalit-100" />
      <div className="h-96 rounded-lg border border-megalit-200 bg-(--color-surface-card)">
        <div className="h-12 border-b border-megalit-200 bg-megalit-50" />
        <div className="space-y-2 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 rounded bg-megalit-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
