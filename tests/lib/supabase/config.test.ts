import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { getSupabaseConfig } from '@/lib/supabase/config'

describe('Supabase configuration', () => {
  it('rejects missing public configuration', () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    assert.throws(() => getSupabaseConfig(), /Konfigurasi Supabase/)
    if (url) process.env.NEXT_PUBLIC_SUPABASE_URL = url
    if (key) process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = key
  })
})
