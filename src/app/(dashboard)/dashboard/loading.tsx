import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <section className="p-6 sm:p-10">
      <div className="mb-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-8 w-48" />
      </div>
      <div className="mb-6 grid gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-10" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={index}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-10 w-16" />
          </div>
        ))}
      </div>
    </section>
  )
}
