import { getDefectSummary } from '@/features/defects/application'
import { createDefectRepository } from '@/features/defects/application/factories'
import { requireSupabaseUser } from '@/lib/supabase/auth'
import { DEFECT_STATUSES } from '@/features/defects/domain/defect-status'

const cards = [
  ['total', 'Total Defect', 'text-slate-900'], ['open', 'Open', 'text-amber-600'],
  ['onProgress', 'On Progress', 'text-blue-600'], ['completed', 'Completed', 'text-emerald-600'],
] as const

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireSupabaseUser()
  const params = await searchParams
  const status = typeof params.status === 'string' && DEFECT_STATUSES.includes(params.status as never) ? params.status as typeof DEFECT_STATUSES[number] : undefined
  const search = typeof params.search === 'string' ? params.search : undefined
  const summary = await getDefectSummary(await createDefectRepository(), { search, status })
  return <section className="p-6 sm:p-10">
    <div className="mb-8"><p className="text-sm font-medium text-slate-500">Monitoring defect</p><h1 className="text-3xl font-bold tracking-tight">Dashboard</h1></div>
    <form className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><input name="search" defaultValue={search} placeholder="Project, unit, atau PIC..." className="min-w-56 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" /><select name="status" defaultValue={status ?? ''} className="rounded-lg border border-slate-300 px-3 py-2 text-sm"><option value="">Semua status</option>{DEFECT_STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}</select><button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Terapkan</button></form>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([key, label, color]) => <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={key}>
        <p className="text-sm font-medium text-slate-500">{label}</p><p className={`mt-3 text-4xl font-bold ${color}`}>{summary[key]}</p>
      </div>)}
    </div>
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-semibold">Ringkasan</h2><p className="mt-2 text-sm text-slate-500">Gunakan menu List Defect untuk melihat dan memfilter data pencatatan.</p></div>
  </section>
}
