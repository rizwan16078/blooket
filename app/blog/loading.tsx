import BlogSkeleton from "@/components/blog/BlogSkeleton";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#080c18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="h-10 w-64 bg-slate-800/50 rounded animate-pulse mb-4" />
          <div className="h-5 w-96 bg-slate-800/50 rounded animate-pulse" />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="h-10 w-72 bg-slate-800/50 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-slate-800/50 rounded-full animate-pulse" />
            <div className="h-10 w-24 bg-slate-800/50 rounded-full animate-pulse" />
            <div className="h-10 w-20 bg-slate-800/50 rounded-full animate-pulse" />
          </div>
        </div>
        <BlogSkeleton count={12} />
      </div>
    </div>
  );
}
