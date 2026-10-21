import { NextResponse } from 'next/server'
import { requireSupabaseUser } from '@/lib/supabase/auth'
import { getBastbs, createBastbRepository } from '@/features/bastbs/application'

export async function GET(request: Request) {
  try {
    await requireSupabaseUser()
    const search = new URL(request.url).searchParams.get('search')?.trim() || undefined
    return NextResponse.json({ items: await getBastbs(await createBastbRepository(), search) })
  } catch {
    return NextResponse.json({ message: 'Terjadi kesalahan pada sistem.' }, { status: 500 })
  }
}
