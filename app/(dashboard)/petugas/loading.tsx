import { PageHeaderSkeleton, TableSkeleton } from "@/components/shared/loading-skeleton";

export default function PetugasLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <PageHeaderSkeleton titleWidth="w-40" subtitleWidth="w-80" actionWidth="w-40" />
      <TableSkeleton rows={4} />
    </div>
  );
}
