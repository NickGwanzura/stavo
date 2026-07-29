import { ListSkeleton } from "@/components/shared/loading-skeleton";

export default function InvoicesLoading() {
  return (
    <div className="space-y-4">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-1" />
        <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <ListSkeleton count={4} />
      </div>
    </div>
  );
}
