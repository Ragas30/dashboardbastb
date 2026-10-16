import { createSupabaseServerClient } from '@/lib/supabase/server'
import { SupabaseDefectRepository } from '../infrastructure/supabase-defect-repository'
import { SupabaseDefectFileRepository } from '../infrastructure/supabase-defect-file-repository'

export async function createDefectRepository() {
  return new SupabaseDefectRepository(await createSupabaseServerClient())
}

export async function createDefectFileRepository() {
  return new SupabaseDefectFileRepository(await createSupabaseServerClient())
}
