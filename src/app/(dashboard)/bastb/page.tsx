import { getBastbs, createBastbRepository } from '@/features/bastbs/application'
import { requireSupabaseUser } from '@/lib/supabase/auth'
import { BastbListClient } from './_components/bastb-list-client'

export default async function BastbPage() {
  await requireSupabaseUser()
  const items = await getBastbs(await createBastbRepository())
  return <section className="p-6 sm:p-10"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-slate-500">Data transaksi sumber defect</p><h1 className="text-3xl font-bold tracking-tight text-slate-700">List BASTB</h1></div><BastbModal /></div><BastbListClient initialItems={items} /></section>
}
