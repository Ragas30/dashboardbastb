'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(formData: FormData) {
    setLoading(true); setError('')
    const supabase = createSupabaseBrowserClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email: String(formData.get('email')), password: String(formData.get('password')) })
    if (authError) setError('Email atau password tidak valid.')
    else router.push('/dashboard')
    setLoading(false)
  }

  return <form action={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <label className="block text-sm font-medium">Email<input required type="email" name="email" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
    <label className="block text-sm font-medium">Password<input required type="password" name="password" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
    {error && <p className="text-sm text-red-600">{error}</p>}
    <button disabled={loading} className="w-full rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">{loading ? 'Memproses...' : 'Login'}</button>
  </form>
}
