import { getDefectSummary } from '@/features/defects/application'
import { createDefectRepository } from '@/features/defects/application/factories'
import { requireSupabaseUser } from '@/lib/supabase/auth'
import { DEFECT_STATUSES } from '@/features/defects/domain/defect-status'
import { getPics } from '@/features/pics/application/get-pics'
import { createPicRepository } from '@/features/pics/application/factories'
import { DEFECT_STATUS_LABELS } from '@/components/shared/defect-status-labels'
import { getBastbs, createBastbRepository } from '@/features/bastbs/application'
import { getDefects } from '@/features/defects/application'

const cards = [
  ['total', 'Total Defect', 'text-slate-700'], ['open', 'Open', 'text-amber-700'],
  ['onProgress', 'On Progress', 'text-sky-700'], ['completed', 'Completed', 'text-emerald-700'],
] as const

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireSupabaseUser()
  const params = await searchParams
  const status = typeof params.status === 'string' && DEFECT_STATUSES.includes(params.status as never) ? params.status as typeof DEFECT_STATUSES[number] : undefined
  const search = typeof params.search === 'string' ? params.search : undefined
  const bastbId = typeof params.bastbId === 'string' && Number(params.bastbId) > 0 ? Number(params.bastbId) : undefined
  const projectCluster = typeof params.projectCluster === 'string' ? params.projectCluster : undefined
  const unit = typeof params.unit === 'string' ? params.unit : undefined
  const picId = typeof params.picId === 'string' && Number(params.picId) > 0 ? Number(params.picId) : undefined
  const defectDateFrom = typeof params.defectDateFrom === 'string' ? new Date(params.defectDateFrom) : undefined
  const defectDateTo = typeof params.defectDateTo === 'string' ? new Date(params.defectDateTo) : undefined
  const filters = { bastbId, search, status, projectCluster, unit, picId, defectDateFrom, defectDateTo }
  const [summary, pics, bastbs, filteredDefects, allDefects] = await Promise.all([
    getDefectSummary(await createDefectRepository(), filters),
    getPics(await createPicRepository()),
    getBastbs(await createBastbRepository()),
    getDefects(await createDefectRepository(), { ...filters, page: 1, pageSize: 10000 }),
    getDefects(await createDefectRepository(), { page: 1, pageSize: 10000 }),
  ])
  const usedBastbIds = new Set(allDefects.items.flatMap((defect) => defect.bastbId ? [defect.bastbId] : []))
  const activeDefects = filteredDefects.items.filter((defect) => defect.status !== 'COMPLETED').sort((a, b) => a.targetRepair.getTime() - b.targetRepair.getTime()).slice(0, 8)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return <section className="p-6 sm:p-10">
    <div className="mb-8"><p className="text-sm font-medium text-slate-500">Monitoring defect</p><h1 className="text-3xl font-semibold tracking-tight text-slate-700">Dashboard</h1></div>
    <form className="mb-6 grid gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"><select name="bastbId" defaultValue={bastbId ?? ''} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"><option value="">Semua BASTB</option>{bastbs.map((item) => <option key={item.id} value={item.id}>{item.cluster} - {item.noUnit}</option>)}</select><input name="projectCluster" defaultValue={projectCluster} placeholder="Project / Cluster" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" /><input name="unit" defaultValue={unit} placeholder="Unit" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" /><input name="search" defaultValue={search} placeholder="Cari project, unit, PIC..." className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" /><select name="picId" defaultValue={picId ?? ''} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"><option value="">Semua PIC</option>{pics.filter((pic) => pic.status === 'ACTIVE').map((pic) => <option key={pic.id} value={pic.id}>{pic.name}</option>)}</select><select name="status" defaultValue={status ?? ''} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"><option value="">Semua status</option>{DEFECT_STATUSES.map((value) => <option key={value} value={value}>{DEFECT_STATUS_LABELS[value]}</option>)}</select><input type="date" name="defectDateFrom" aria-label="Tanggal dari" defaultValue={typeof params.defectDateFrom === 'string' ? params.defectDateFrom : ''} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" /><input type="date" name="defectDateTo" aria-label="Tanggal sampai" defaultValue={typeof params.defectDateTo === 'string' ? params.defectDateTo : ''} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" /><button className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Terapkan Filter</button></form>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([key, label, color]) => <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={key}>
        <p className="text-sm font-medium text-slate-500">{label}</p><p className={`mt-3 text-4xl font-bold ${color}`}>{summary[key]}</p>
      </div>)}
    </div>
    <div className="mt-4 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Total BASTB</p><p className="mt-2 text-3xl font-bold text-slate-700">{bastbs.length}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">BASTB Sudah Dipakai</p><p className="mt-2 text-3xl font-bold text-sky-700">{usedBastbIds.size}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">BASTB Belum Dipakai</p><p className="mt-2 text-3xl font-bold text-amber-700">{Math.max(0, bastbs.length - usedBastbIds.size)}</p></div></div>
    <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-4"><h2 className="font-semibold">Monitoring Defect Aktif</h2><p className="mt-1 text-sm text-slate-500">Defect Open dan On Progress dengan target repair terdekat.</p></div>{activeDefects.length === 0 ? <p className="text-sm text-slate-500">Tidak ada defect aktif.</p> : <table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase text-slate-500"><tr><th className="py-3">Cluster</th><th className="py-3">Unit</th><th className="py-3">Total</th><th className="py-3">Status</th><th className="py-3">PIC</th><th className="py-3">Target Repair</th></tr></thead><tbody>{activeDefects.map((defect) => <tr key={defect.id} className="border-b border-slate-100 last:border-0"><td className="py-3">{defect.projectCluster}</td><td>{defect.unit}</td><td>{defect.totalDefect}</td><td>{DEFECT_STATUS_LABELS[defect.status]}</td><td>{defect.pic?.name ?? '-'}</td><td className={defect.targetRepair < today ? 'font-semibold text-red-600' : 'text-slate-600'}>{defect.targetRepair.toLocaleDateString('id-ID')}{defect.targetRepair < today ? ' · Terlambat' : ''}</td></tr>)}</tbody></table>}</div>
  </section>
}
