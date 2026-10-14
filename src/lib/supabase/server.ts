import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseConfig } from './config'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  const { url, publishableKey } = getSupabaseConfig()
  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(values) {
        try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch { /* read-only Server Component */ }
      },
    },
  })
}
