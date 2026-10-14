import Link from 'next/link'
import { getPics } from '@/features/pics/application/get-pics'
import { createPicRepository } from '@/features/pics/application/factories'
import { DefectForm } from '../_components/defect-form'
import { requireSupabaseUser } from '@/lib/supabase/auth'

export default async function NewDefectPage() {
  await requireSupabaseUser()
  const pics = await getPics(await createPicRepository())
  return <section className="p-6 sm:p-10"><div className="mb-8 flex items-center justify-between"><h1 className="text-3xl font-bold">Tambah Defect</h1><Link href="/defects" className="text-sm text-slate-500">Kembali</Link></div><DefectForm pics={pics} /></section>
}
