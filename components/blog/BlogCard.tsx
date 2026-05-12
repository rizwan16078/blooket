import Image from "next/image";
import Link from "next/link";
import { Calendar, Calculator } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
  hasCalculator?: boolean;
}

export default function BlogCard({ slug, title, excerpt, date, category, imageUrl, hasCalculator = true }: BlogCardProps) {
  return (
    <div className="flex flex-col bg-[#0f1629] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors group relative">
      {/* Image container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-900">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <span className="bg-[#1a2333]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            {category}
          </span>
          {hasCalculator && (
            <span className="bg-emerald-100/90 backdrop-blur-sm text-emerald-950 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-emerald-200/50">
              <Calculator className="w-3.5 h-3.5" />
              Free Calculator Inside
            </span>
          )}
        </div>
      </div>
      
      {/* Content container */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-emerald-400 transition-colors">
          <Link href={`/blog/${slug}`}>
            <span className="absolute inset-0"></span>
            {title}
          </Link>
        </h3>
        
        <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-2">
          {excerpt}
        </p>
        
        <div className="mt-auto">
          <span className="text-emerald-400 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            {hasCalculator ? "Read & Calculate" : "Read Full Guide"} <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </div>
    </div>
  );
}
