import { createSupabaseServerClient } from '@/lib/supabase/server'
import { SupabaseDefectRepository } from '../infrastructure/supabase-defect-repository'

export async function createDefectRepository() {
  return new SupabaseDefectRepository(await createSupabaseServerClient())
}
