export function HeroGridSkeleton() {
  return (
    <div className="hero-card-grid grid gap-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl border border-white bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="h-52 animate-pulse bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-4 p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 animate-pulse rounded bg-slate-100 dark:bg-slate-800/80" />
            <div className="h-12 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/80" />
          </div>
        </div>
      ))}
    </div>
  );
}
