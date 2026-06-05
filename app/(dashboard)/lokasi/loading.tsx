import { PageHeaderSkeleton, TableSkeleton } from "@/components/shared/loading-skeleton";

export default function LokasiLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <PageHeaderSkeleton actionWidth="w-36" />
      <TableSkeleton rows={5} />
    </div>
  );
}
