export default function BlogSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-[#0f1629] border border-slate-800 rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="h-56 w-full bg-slate-800/50" />
          <div className="flex flex-col flex-1 p-6 gap-3">
            <div className="h-4 w-24 bg-slate-800/50 rounded" />
            <div className="h-5 w-full bg-slate-800/50 rounded" />
            <div className="h-5 w-3/4 bg-slate-800/50 rounded" />
            <div className="h-4 w-full bg-slate-800/50 rounded mt-2" />
            <div className="h-4 w-1/2 bg-slate-800/50 rounded" />
            <div className="mt-auto h-4 w-28 bg-slate-800/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
