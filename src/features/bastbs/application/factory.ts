import { createSupabaseServerClient } from '@/lib/supabase/server'
import { SupabaseBastbRepository } from '../infrastructure/supabase-bastb-repository'
export async function createBastbRepository() { return new SupabaseBastbRepository(await createSupabaseServerClient()) }
