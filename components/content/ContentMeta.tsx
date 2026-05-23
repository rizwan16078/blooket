type ContentSource = {
  label: string;
  href: string;
};

type ContentMetaProps = {
  publishedAt?: string;
  updatedAt: string;
  sources: ContentSource[];
  note?: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function ContentMeta({
  publishedAt,
  updatedAt,
  sources,
  note,
}: ContentMetaProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-sm text-white/65 shadow-lg">
      <div className="flex flex-wrap gap-4">
        {publishedAt ? (
          <p>
            Published: <span className="font-semibold text-white">{formatDate(publishedAt)}</span>
          </p>
        ) : null}
        <p>
          Updated: <span className="font-semibold text-white">{formatDate(updatedAt)}</span>
        </p>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-400">
          Source notes
        </p>
        <ul className="mt-2 space-y-2">
          {sources.map((source) => (
            <li key={source.href}>
              <a
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {note ? <p className="mt-4 text-white/50">{note}</p> : null}
    </div>
  );
}
