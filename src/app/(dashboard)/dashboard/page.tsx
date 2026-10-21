import { requireSupabaseUser } from '@/lib/supabase/auth'
import { createDefectRepository } from '@/features/defects/application/factories'
import { createPicRepository } from '@/features/pics/application/factories'
import { createBastbRepository } from '@/features/bastbs/application'
import { getDashboardData } from '@/features/defects/application/dashboard-data'
import { DashboardClient } from './_components/dashboard-client'

export default async function DashboardPage() {
  await requireSupabaseUser()
  const initialData = await getDashboardData(
    await createDefectRepository(),
    await createPicRepository(),
    await createBastbRepository(),
    {},
  )

  return <section className="p-6 sm:p-10"><div className="mb-8"><p className="text-sm font-medium text-slate-500">Monitoring defect</p><h1 className="text-3xl font-semibold tracking-tight text-slate-700">Dashboard</h1></div><DashboardClient initialData={initialData} /></section>
}
