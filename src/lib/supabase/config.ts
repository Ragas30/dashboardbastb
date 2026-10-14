import { InfrastructureError } from '@/lib/errors'

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !publishableKey) {
    throw new InfrastructureError('Konfigurasi Supabase belum tersedia.')
  }
  return { url, publishableKey }
}
