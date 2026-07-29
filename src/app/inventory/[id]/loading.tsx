export default function ProductDetailLoading() {
  return (
    <div className="pb-24">
      <div className="sticky top-0 bg-white border-b border-slate-200 z-10">
        <div className="flex items-center gap-3 px-4 h-14">
          <div className="h-5 w-5 bg-slate-200 rounded animate-pulse" />
          <div className="flex-1 space-y-1">
            <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="px-4 py-4 space-y-4">
        <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
