import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <section className="p-6 sm:p-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="mt-3 h-8 w-40" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="mb-4 h-10 w-full max-w-sm" />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="flex items-center gap-4 px-5 py-4" key={index}>
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="hidden h-4 w-24 sm:block" />
              <Skeleton className="hidden h-4 w-28 sm:block" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
