import { getBastbs, createBastbRepository } from '@/features/bastbs/application'
import { requireSupabaseUser } from '@/lib/supabase/auth'
import { BastbModal } from './_components/bastb-modal'

export default async function BastbPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireSupabaseUser()
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : undefined
  const items = await getBastbs(await createBastbRepository(), search)
  return <section className="p-6 sm:p-10">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-slate-500">Data transaksi sumber defect</p><h1 className="text-3xl font-bold tracking-tight text-slate-700">List BASTB</h1></div><BastbModal /></div>
    <form className="mb-4 flex gap-2"><input name="search" defaultValue={search} placeholder="Cari cluster atau no unit..." className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" /><button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm">Cari</button></form>
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">{items.length === 0 ? <div className="p-10 text-center text-sm text-slate-500">Belum ada data BASTB.</div> : <table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">No</th><th className="py-3">Cluster</th><th className="py-3">No Unit</th><th className="py-3">Tanggal BASTB</th><th className="py-3">Action</th></tr></thead><tbody>{items.map((item, index) => <tr key={item.id} className="border-b border-slate-100 last:border-0"><td className="px-5 py-4 text-slate-400">{index + 1}</td><td className="font-medium">{item.cluster}</td><td>{item.noUnit}</td><td>{item.bastbDate.toLocaleDateString('id-ID')}</td><td><BastbModal item={item} /></td></tr>)}</tbody></table>}</div>
  </section>
}
