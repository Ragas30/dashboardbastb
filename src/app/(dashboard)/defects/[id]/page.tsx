import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDefectById } from '@/features/defects/application'
import { createDefectRepository } from '@/features/defects/application/factories'
import { getPics } from '@/features/pics/application/get-pics'
import { createPicRepository } from '@/features/pics/application/factories'
import { DefectForm } from '../_components/defect-form'
import { DeleteDefectButton } from '../_components/delete-defect-button'
import { requireSupabaseUser } from '@/lib/supabase/auth'

export default async function DefectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSupabaseUser()
  const { id } = await params
  const defect = await getDefectById(await createDefectRepository(), Number(id)).catch(() => null)
  if (!defect) notFound()
  const pics = await getPics(await createPicRepository())
  return <section className="p-6 sm:p-10"><div className="mb-8 flex items-center justify-between"><div><p className="text-sm text-slate-500">Defect #{defect.id}</p><h1 className="text-3xl font-bold">Detail Defect</h1></div><div className="flex items-center gap-4"><Link href="/defects" className="text-sm text-slate-500">Kembali</Link><DeleteDefectButton id={defect.id} /></div></div><DefectForm defect={defect} pics={pics} /></section>
}
