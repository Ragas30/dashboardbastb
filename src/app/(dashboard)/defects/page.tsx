import Link from 'next/link'
import { getDefects } from '@/features/defects/application'
import { createDefectRepository } from '@/features/defects/application/factories'
import { requireSupabaseUser } from '@/lib/supabase/auth'

export default async function DefectsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireSupabaseUser()
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : undefined
  const page = Number(params.page) || 1
  const result = await getDefects(await createDefectRepository(), { search, page })
  return <section className="p-6 sm:p-10"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm text-slate-500">Pencatatan dan monitoring</p><h1 className="text-3xl font-bold">List Defect</h1></div><Link className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white" href="/defects/new">+ Tambah Defect</Link></div>
    <form className="mb-4 flex gap-2"><input className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" name="search" defaultValue={search} placeholder="Cari project, unit, PIC..." /><button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm">Cari</button></form>
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">{result.items.length === 0 ? <div className="p-10 text-center text-sm text-slate-500">Belum ada data defect.</div> : <table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Project / Cluster</th><th>Unit</th><th>Total</th><th>PIC</th><th>Status</th><th>Target Repair</th><th>Action</th></tr></thead><tbody>{result.items.map((defect) => <tr className="border-b border-slate-100 last:border-0" key={defect.id}><td className="px-5 py-4 font-medium">{defect.projectCluster}</td><td>{defect.unit}</td><td>{defect.totalDefect}</td><td>{defect.pic?.name ?? '-'}</td><td><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">{defect.status}</span></td><td>{defect.targetRepair.toLocaleDateString('id-ID')}</td><td><Link className="font-semibold text-blue-600" href={`/defects/${defect.id}`}>Detail</Link></td></tr>)}</tbody></table>}</div>
    <div className="mt-4 flex items-center justify-between text-sm text-slate-500"><p>Menampilkan {result.items.length} dari {result.total} data.</p><div className="flex gap-2">{page > 1 && <Link className="rounded border border-slate-300 px-3 py-1" href={`/defects?${new URLSearchParams({ ...(search ? { search } : {}), page: String(page - 1) })}`}>Sebelumnya</Link>}{result.items.length === 10 && <Link className="rounded border border-slate-300 px-3 py-1" href={`/defects?${new URLSearchParams({ ...(search ? { search } : {}), page: String(page + 1) })}`}>Berikutnya</Link>}</div></div>
  </section>
}
