import { PageHeaderSkeleton, TableSkeleton } from "@/components/shared/loading-skeleton";

export default function TransaksiLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <PageHeaderSkeleton />
      <div className="h-40 rounded-lg bg-megalit-100" />
      <TableSkeleton rows={5} />
    </div>
  );
}
