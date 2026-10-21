import { NextResponse } from 'next/server'
import { requireSupabaseUser } from '@/lib/supabase/auth'
import { createDefectRepository } from '@/features/defects/application/factories'
import { createPicRepository } from '@/features/pics/application/factories'
import { createBastbRepository } from '@/features/bastbs/application'
import { getDashboardData } from '@/features/defects/application/dashboard-data'

export async function GET(request: Request) {
  try {
    await requireSupabaseUser()
    const params = new URL(request.url).searchParams
    const data = await getDashboardData(await createDefectRepository(), await createPicRepository(), await createBastbRepository(), Object.fromEntries(params))
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: 'Terjadi kesalahan pada sistem.' }, { status: 500 })
  }
}
