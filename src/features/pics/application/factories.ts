import { createSupabaseServerClient } from '@/lib/supabase/server'
import { SupabasePicRepository } from '../infrastructure/supabase-pic-repository'

export async function createPicRepository() {
  return new SupabasePicRepository(await createSupabaseServerClient())
}
