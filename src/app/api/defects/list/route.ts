import { NextResponse } from 'next/server'
import { requireSupabaseUser } from '@/lib/supabase/auth'
import { getDefects } from '@/features/defects/application'
import { createDefectRepository } from '@/features/defects/application/factories'

export async function GET(request: Request) {
  try {
    await requireSupabaseUser()
    const params = new URL(request.url).searchParams
    const page = Math.max(1, Number(params.get('page')) || 1)
    const result = await getDefects(await createDefectRepository(), { search: params.get('search')?.trim() || undefined, page, pageSize: 10 })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ message: 'Terjadi kesalahan pada sistem.' }, { status: 500 })
  }
}
